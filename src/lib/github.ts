export type GitHubContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

export interface GitHubContributionDay {
  contributionCount: number;
  contributionLevel: GitHubContributionLevel;
  date: string;
  weekday: number;
}

export interface GitHubContributionWeek {
  firstDay: string;
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionMonth {
  label: string;
  startWeekIndex: number;
  totalWeeks: number;
}

export interface GitHubContributionCalendar {
  username: string;
  profileUrl: string;
  totalContributions: number;
  rangeLabel: string;
  weeks: GitHubContributionWeek[];
  months: GitHubContributionMonth[];
  error?: string;
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubContributionWeek[];
          months: Array<{
            name: string;
            totalWeeks: number;
          }>;
        };
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const DEFAULT_USERNAME = 'Ning0713';
const DEFAULT_CONTRIBUTION_YEAR = 2026;

const contributionQuery = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          months {
            name
            totalWeeks
          }
          weeks {
            firstDay
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

function createUtcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day));
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfUtcWeek(date: Date) {
  return addUtcDays(date, -date.getUTCDay());
}

function endOfUtcWeek(date: Date) {
  return addUtcDays(date, 6 - date.getUTCDay());
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatRangeLabel(year: number) {
  return String(year);
}

function getMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  }).format(createUtcDate(year, month, 1));
}

function normalizeContributionCalendar(
  weeks: GitHubContributionWeek[],
  targetYear: number,
  queryEnd: Date,
) {
  const yearStart = createUtcDate(targetYear, 0, 1);
  const yearEnd = createUtcDate(targetYear, 11, 31);
  const gridStart = startOfUtcWeek(yearStart);
  const gridEnd = endOfUtcWeek(yearEnd);
  const contributionMap = new Map(
    weeks.flatMap((week) => week.contributionDays.map((day) => [day.date, day] as const)),
  );

  const normalizedWeeks: GitHubContributionWeek[] = [];

  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addUtcDays(cursor, 7)) {
    const contributionDays: GitHubContributionDay[] = [];

    for (let offset = 0; offset < 7; offset += 1) {
      const currentDay = addUtcDays(cursor, offset);
      const isoDate = formatIsoDate(currentDay);
      const existingDay = contributionMap.get(isoDate);
      const isInTargetYear = currentDay >= yearStart && currentDay <= yearEnd;
      const isFutureDay = currentDay > queryEnd;

      contributionDays.push(
        existingDay && isInTargetYear && !isFutureDay
          ? existingDay
          : {
              contributionCount: 0,
              contributionLevel: 'NONE',
              date: isoDate,
              weekday: currentDay.getUTCDay(),
            },
      );
    }

    normalizedWeeks.push({
      firstDay: formatIsoDate(cursor),
      contributionDays,
    });
  }

  const months: GitHubContributionMonth[] = Array.from({ length: 12 }, (_, monthIndex) => ({
    label: getMonthLabel(targetYear, monthIndex),
    startWeekIndex: normalizedWeeks.findIndex((week) =>
      week.contributionDays.some((day) => {
        const dayDate = new Date(`${day.date}T00:00:00Z`);
        return dayDate.getUTCFullYear() === targetYear && dayDate.getUTCMonth() === monthIndex;
      }),
    ),
    totalWeeks: normalizedWeeks.filter((week) =>
      week.contributionDays.some((day) => {
        const dayDate = new Date(`${day.date}T00:00:00Z`);
        return dayDate.getUTCFullYear() === targetYear && dayDate.getUTCMonth() === monthIndex;
      }),
    ).length,
  })).map((month) => ({
    ...month,
    startWeekIndex: Math.max(month.startWeekIndex, 0),
  }));

  const totalContributions = normalizedWeeks.reduce(
    (sum, week) =>
      sum +
      week.contributionDays.reduce((weekSum, day) => {
        const dayDate = new Date(`${day.date}T00:00:00Z`);
        const isInTargetYear = dayDate >= yearStart && dayDate <= yearEnd;
        return weekSum + (isInTargetYear ? day.contributionCount : 0);
      }, 0),
    0,
  );

  return {
    totalContributions,
    weeks: normalizedWeeks,
    months,
    rangeLabel: formatRangeLabel(targetYear),
  };
}

export async function getGitHubContributionCalendar() {
  const username = import.meta.env.GITHUB_USERNAME ?? DEFAULT_USERNAME;
  const token = import.meta.env.GITHUB_TOKEN;
  const targetYear = Number(import.meta.env.GITHUB_CONTRIBUTION_YEAR ?? DEFAULT_CONTRIBUTION_YEAR);
  const profileUrl = `https://github.com/${username}`;

  if (!token) {
    return {
      username,
      profileUrl,
      totalContributions: 0,
      rangeLabel: formatRangeLabel(targetYear),
      weeks: [],
      months: [],
      error: 'Set GITHUB_USERNAME and GITHUB_TOKEN in .env to load GitHub contributions.',
    } satisfies GitHubContributionCalendar;
  }

  const now = new Date();
  const from = createUtcDate(targetYear, 0, 1);
  const yearEnd = createUtcDate(targetYear, 11, 31);
  const to = now < yearEnd ? now : yearEnd;

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ning0713-personal-site',
      },
      body: JSON.stringify({
        query: contributionQuery,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const payload = (await response.json()) as GitHubGraphQLResponse;

    if (payload.errors?.length) {
      throw new Error(payload.errors[0]?.message ?? 'Unknown GitHub API error');
    }

    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error('No contribution calendar returned from GitHub.');
    }

    const normalizedCalendar = normalizeContributionCalendar(calendar.weeks, targetYear, to);

    return {
      username,
      profileUrl,
      totalContributions: normalizedCalendar.totalContributions,
      rangeLabel: normalizedCalendar.rangeLabel,
      weeks: normalizedCalendar.weeks,
      months: normalizedCalendar.months,
    } satisfies GitHubContributionCalendar;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load GitHub contributions.';

    return {
      username,
      profileUrl,
      totalContributions: 0,
      rangeLabel: formatRangeLabel(targetYear),
      weeks: [],
      months: [],
      error: message,
    } satisfies GitHubContributionCalendar;
  }
}
