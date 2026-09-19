# Validated end-to-end demo

MinuteShield was tested against a controlled pull request in its own repository before public release.

The fixture intentionally introduced a workflow containing a standard macOS runner and no pull-request concurrency cancellation. MinuteShield's trusted `main` Action analyzed the proposed YAML and posted a sticky `github-actions[bot]` report on the pull request.

## Actual validation result

The test report identified:

- an estimated changed-workflow monthly delta of **+$0.12** for the deliberately low-frequency fixture;
- a **macos-runner** finding explaining that standard macOS runner minutes cost materially more than standard Linux minutes; and
- a **missing-cancel-in-progress** finding explaining that obsolete pull-request runs may keep consuming minutes after a newer push.

The exact dollar value was intentionally small because the fixture's fallback run-frequency assumption was small. The purpose of this test was not to manufacture an impressive savings number; it was to verify the full behavior chain: workflow diff → parser → estimate → findings → sticky PR comment.

After the fixture was changed so its macOS job could not execute, MinuteShield re-ran and updated the same sticky comment. The Action self-test and the repository's full build/test CI both completed successfully.

The controlled test pull request was closed without merging.

## What this proves

It verifies that the shipped Action can analyze a real pull-request workflow change through GitHub's hosted infrastructure and publish its result back into code review without executing the proposed workflow content as part of the analysis.

It does **not** prove a guaranteed savings amount, adoption rate, revenue level or exact future GitHub bill. Those require real post-launch usage data.
