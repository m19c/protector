# protector

[branch protection][branch_protection] as code!

---

## Motivation

In larger organizations / projects, not everyone can access the configuration of a repository. Therefore, engineers are not able to see and edit the current [Branch Protection Rules][branch_protection]. This can lead to confusion.
Good documentation might reduce the lack of clarity but also requires effort to keep up to date.

Keeping the protection rules as close to the source code as possible clarifies the way how the team actually works.

## Versioning

protector versions are defined as `vx.y.z`, where `x` is the major version, `y` is the minor version, and `z` is the patch version, following [Semantic Versioning][semver] terminology.

To support multiple versions at the same time and also to keep things simple, protector uses release branches for the most recent two major releases. Fixes (e.g. security, bugs etc.) may be backported to those branches.

| Version    | Status   |
| ---------- | -------- |
| [`v1`][v1] | Active   |
| `v2`       | Inactive |

## Getting started

1. To use protector, a custom personal access token with the scopes `repo` and optionally, `read:org`, is required. Follow the steps described on [Creating a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).
1. Next up: [Creating encrypted secrets for a repository](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) / [Creating encrypted secrets for an organization](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-an-organization) to create a secret called `PROTECTOR_TOKEN`.
1. Create a new workflow file (e.g. `.github/workflows/enforce-protection.yml`).

   ```yaml
   name: protector
   on: push

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: m19c/protector@v1
           with:
             token: ${{ secrets.PROTECTOR_TOKEN }}
   ```

1. Generate a `protector.yml` file inside `.github/`. It is also possible to configure the location of your configuration file by passing `config` (`with: { config: "path/to/my/config.yml" }`).

   ```yaml
   patterns:
     - dev
     - master

   allowsDeletions: false

   overrides:
     dev:
       requiresLinearHistory: true
     master:
       isAdminEnforced: true
       reviewDismissalActors:
         - @m19c
   ```

1. Push the changes.
1. Profit!

## Configuration

| Property    | Description                                                      | Example             |
| ----------- | ---------------------------------------------------------------- | ------------------- |
| `patterns`  | List of patterns to match the actual branches.                   | `['dev', 'master']` |
| `...`       | Any of _RuleSet_.                                                | -                   |
| `overrides` | Map of _RuleSet_ overrides to be more specific in certain cases. | -                   |

### RuleSet

| Property                       | Type            | Description                                                                                            |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------ |
| `allowsDeletions`              | `boolean`       | Can this branch be deleted.                                                                            |
| `allowsForcePushes`            | `boolean`       | Are force pushes allowed on this branch.                                                               |
| `dismissesStaleReviews`        | `boolean`       | Will new commits pushed to matching branches dismiss pull request review approvals.                    |
| `isAdminEnforced`              | `boolean`       | Can admins overwrite branch protection.                                                                |
| `requiredApprovingReviewCount` | `boolean`       | Number of approving reviews required to update matching branches.                                      |
| `requiresApprovingReviews`     | `boolean`       | Are approving reviews required to update matching branches.                                            |
| `requiresCodeOwnerReviews`     | `boolean`       | Are reviews from code owners required to update matching branches.                                     |
| `requiresCommitSignatures`     | `boolean`       | Are commits required to be signed.                                                                     |
| `requiresLinearHistory`        | `boolean`       | Are merge commits prohibited from being pushed to this branch.                                         |
| `restrictsReviewDismissals`    | `boolean`       | Is dismissal of pull request reviews restricted.                                                       |
| `restrictsPushes`              | `boolean`       | Is pushing to matching branches restricted.                                                            |
| `requiredStatusCheckContexts`  | `boolean`       | List of required status check contexts that must pass for commits to be accepted to matching branches. |
| `requiresStatusChecks`         | `boolean`       | Are status checks required to update matching branches.                                                |
| `requiresStrictStatusChecks`   | `Array<string>` | Are branches required to be up to date before merging.                                                 |
| `reviewDismissalActors`        | `Array<string>` | A list of User (`@<username>`) and / or Team (`#<team>`) allowed to dismiss pull requests.             |
| `pushActors`                   | `Array<string>` | A list of User (`@<username>`) and / or Team (`#<team>`) allowed to push to matching branches.         |

### Real World Example

```yaml
patterns:
  - dev
  - staging
  - master

allowsDeletions: false
allowsForcePushes: false
dismissesStaleReviews: true
isAdminEnforced: true
requiredApprovingReviewCount: 1
requiresApprovingReviews: true
requiresCodeOwnerReviews: true
requiresCommitSignatures: true
requiresLinearHistory: true
restrictsReviewDismissals: false
restrictsPushes: true
pushActors:
  - '#developer'
requiresStatusChecks: true
requiredStatusCheckContexts:
  - continuous-integration/jenkins/branch
requiresStrictStatusChecks: true
reviewDismissalActors:
  - '#developer'

overrides:
  master:
    requiredApprovingReviewCount: 2
```

## Development

### Workflow

protector requires both the action itself and a config file. The configuration describes whether or not a branch should be considered and how the branch should be protected.

```
                 ┌───────────────GITHUB──────────────┐
                 │                                   │
                 │     ┌───────────┐                 │
                 │     │ PROTECTOR │                 │
                 │     │    ACTION │◄────R/W──┐      │
                 │     └───────────┘          │      │
                 │            ▲               ▼      │
                 │            │            ┌─────┐   │
                 │            │            │ API │   │
                 │         TRIGGER         └─────┘   │
                 │            │                      │
                 │            │                      │
┌────────┐       │          ┌─┴──────────┐           │
│ CHANGE ├───── PUSH───────►│ REPOSITORY │           │
└────────┘       │          └────────────┘           │
                 │                                   │
                 └───────────────────────────────────┘
```

## Known limitations

- Both `reviewDismissalActors` as well as `pushActors` are limited to `100` items.
- `reviewDismissalActors` and `pushActors` can only hold Teams / Users.
- Some options are only available for organizations either with or without Team / Enterprise plan.
- Strict pattern checks: GitHub offers dynamic branch matching, for example `v*` will match branches like `v1`, `v2` and so on. However, `protector` is only able to match patterns equally.

[v1]: https://github.com/m19c/protector/tree/v1
[semver]: https://semver.org/
[branch_protection]: https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule
