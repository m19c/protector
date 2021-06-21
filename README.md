# protector

Enforcing [Branch Protection Rules](https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule) can sometimes be painful.
In teams neither the visibility nor the ability to change protection rules is always given. Allowing individuals and teams to view and adjust them makes every workflow more transparent. `protector` enforces "branch protection as code" just the way we're working in modern software development.

## Getting started

1. Create a new workflow file (e.g. `.github/workflows/protector.yml`):

   ```yaml
   name: protector
   on: push

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: m19c/protector
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

## Known limitations

- Both `reviewDismissalActors` as well as `pushActors` are limited to `100` items.
- `reviewDismissalActors` and `pushActors` can only hold Teams / Users.
- Some options are only available for organizations either with or without Team / Enterprise plan.
- Strict pattern checks: GitHub offers dynamic branch matching, for example `v*` will match branches like `v1`, `v2` and so on. However, `protector` is only able to match patterns equally.

## Require Token Scopes

- `repo`
- `read:org`
