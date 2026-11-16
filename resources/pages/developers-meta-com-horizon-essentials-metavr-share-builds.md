# Share a build with a link | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-share-builds
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Nov 10, 2026

Send your app to testers, friends, or family with one command:

metavr store share path/to/app.apk

The command creates an app and a release channel for you, uploads your build, and returns a link that you can share with people to test your app. Anyone you send the link to can open it, join, and install your app on their Meta VR device. They don’t need a developer account.

Sharing a build does not require submitting the app for publication in the Meta Horizon Store. A newly created app remains unpublished and does not appear in Store listings or search results.

- A Meta account.
- Meta VR CLI installed. See [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install).
- An APK of your app.

If this is your first time sharing, the CLI identifies any additional setup required for your account or team. Complete the indicated steps, then run the command again. See [First time sharing](https://developers.meta.com#first-time-sharing).

1. Sign in: metavr auth login If you aren’t registered as a Meta VR developer yet, the sign-in page sends you to registration, which is free. Register, then run`metavr auth login` again.
2. Share your APK: metavr store share path/to/app.apk
3. Answer the prompts: choose the team that owns the app, and confirm the app name, which defaults to the APK’s file name. If additional setup is required, the CLI opens the setup page in your browser, or prints its link when it can’t open one. Complete the setup, then run the command again.
4. When the upload finishes, the command prints your link: Share URL: https://www.meta.com/s/\<TOKEN> App ID: \<APP\_ID> Binary ID: \<BINARY\_ID> Build status: passed (ready to install) Manage release channel: https://developers.meta.com/vr/manage/applications/\<APP\_ID>/release-channels/\<CHANNEL\_ID> The`Binary ID` and `Build status` lines appear only when the upload tool reports a binary ID.Send the share URL to the people you want to try your app. Anyone who has the link can join, so share it with people you trust. Save the app ID. You will use it to upload new builds and manage the share link.

The CLI tells you when your account or team needs one of these steps. You complete each one once.

| Step | When it comes up | What it takes | 
|---|---|---|
| Register as a Meta VR developer | Signing in says that a Meta VR developer account is required | Free registration, which includes verifying your account. Then sign in again. | 
| Set up a developer team | You do not belong to a developer team that supports app distribution | Create a developer team using the setup page linked by the CLI. | 
| Accept the Developer Distribution Agreement | Your team has not accepted the agreement | One authorized team member reviews and accepts the agreement online on behalf of the team. | 
| Install the upload tool | Before your first upload | `metavr tools install platform-utils` | 

The command also checks your APK before it creates anything. If the APK needs a fix, such as a missing APK Signature Scheme v2 signature, the error says what to change.

Run the command again with the app ID. The link stays the same, and people who already joined get the new build as an update:

metavr store share path/to/app.apk --app-id \<APP\_ID>

Give each new build a higher `versionCode` than the last one, and sign it with the same key.

Recipients need a Meta account and must be 18 or older. They don’t need a developer account.

1. They open the link on a computer or phone and sign in with their Meta account.
2. They join the channel from the page. The page tells them that their email address and alias are shared with you.
3. They select **Install on headset**. If they have more than one device, they choose which one. If the device is off or offline, it installs the app when it’s next online, as long as that’s within a week.

The app also appears in the Library on the recipient’s device. Recipients in South Korea can join only if your app has a non-mature rating from the Game Rating and Administration Committee (GRAC).

| Task | How | 
|---|---|
| Print the link again | `metavr store share url --app-id <APP_ID>` | 
| Replace the link | `metavr store share rotate-link --app-id <APP_ID>`. The old link stops working for new people. People who already joined keep access. | 
| Turn the link off | In the Developer Dashboard, open your app, then select **Distribution** > **Release Channels** > **shared-link** > **Channel Settings**. Clear **Grant access to users by URL** and save. The link’s page stops working, and no one new can join by the link. Select the box again to restore the same link. | 
| See who joined, or remove someone | In the [Developer Dashboard](https://developers.meta.com/vr/manage/), open your app, then select **Distribution** > **Release Channels** > **shared-link** > **Users**. Removing or blocking someone stops new builds from reaching them. It doesn’t remove a build they already installed. | 
| Show a description and image on the link’s page | In the Developer Dashboard, add them under **App Submission** > **App Metadata**. You don’t have to submit the app. | 

By default, the release channel supports up to 200 members. Test users created on your team do not count toward this limit. The invite page stops accepting new members 90 days after the latest build upload to the channel. Upload a new build to re-enable the invite page. For more about release channels, see [Add users to a release channel](https://developers.meta.com/vr/resources/publish-release-channels-add-users/).

Coding agents and scripts can run the same command. Without an interactive terminal, the command doesn’t prompt, so pass the team with `--org-id`. To list your teams and whether each one can share, run:

metavr store share orgs

To read the result as JSON, add `--format json`:

metavr --format json store share path/to/app.apk --org-id \<ORG\_ID>

Without `--app-id`, the command creates a new app. To update an existing link, pass its `--app-id`.

With `--format json`, the command doesn’t open a browser. When the account or team needs a step from [First time sharing](https://developers.meta.com#first-time-sharing), the error’s `action_url` is the page a person opens to complete it. The upload tool is the exception: a script can install it with `metavr tools install platform-utils`.

On success, the JSON includes `share_url`, `app_id`, and `manage_url`, and the command exits with status 0. On failure, it exits with status 1, and the JSON’s `error` object carries a `code`, a `message`, and an `action_url` when there’s a page to visit. Invalid arguments exit with status 2.

| Error | What to do | 
|---|---|
| Signing in says that a Meta VR developer account is required | Register as a Meta VR developer from the sign-in page, then run `metavr auth login` again. | 
| `unrecognized subcommand 'share'` | Sign in with `metavr auth login`, then run the command again. If it’s still unrecognized, update Meta VR CLI with `metavr update` and try again. If the command is still missing after that, sharing isn’t enabled for your account. | 
| `NOT_ENTITLED` | Sharing isn’t enabled for your account. Signing in again doesn’t change that. | 
| `NOT_AUTHENTICATED` | Run `metavr auth login`. | 
| `NO_HORIZON_PROFILE` | Create a Meta Horizon profile for your Meta account, then run `metavr auth login`. | 
| `NO_DEVELOPER_TEAM` or `DEFAULT_ORG_UNSUPPORTED` | Create a developer team using the setup page linked by the CLI. Then run the command again with `--org-id`. | 
| `DDA_UNSIGNED` | Have an authorized team member accept the Developer Distribution Agreement on the linked page, then run the command again. | 
| `ORG_ID_REQUIRED` | Pass `--org-id`. To find it, run `metavr store share orgs`. | 
| `UPLOAD_TOOL_MISSING` | Run `metavr tools install platform-utils`. | 
| `APK_UNSIGNED` | Sign the APK with APK Signature Scheme v2, for example with `apksigner`. Builds signed by Android Studio have one by default. | 
| `APK_INVALID` | Build an APK. Android App Bundles (`.aab`) aren’t supported. | 
| `APP_NAME_CONFLICT` | To share to the existing app, pass its `--app-id`. Otherwise, choose another `--app-name`. | 
| A failure after the command created an app | Run the command again with the same APK and the `--app-id` that the output names. Outside an interactive terminal, also pass `--org-id`. Leaving out `--app-id` creates another app. `--app-name` and `--yes` can’t be combined with `--app-id`, so the command rejects either one as an invalid argument. | 
| `PREVALIDATION_FAILED` | Fix the problems that the error lists, such as a package name that another app uses or a `versionCode` that isn’t higher than the last build’s. Then run the command again. | 
| `NETWORK_ERROR` | Check your connection and run the command again. | 

- [Add users to a release channel](https://developers.meta.com/vr/resources/publish-release-channels-add-users/): how release channels and invite links work.
- [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install): install the CLI and connect it to your AI coding agent.
- [Work with devices and apps](https://developers.meta.com/vr/essentials/metavr-devices-and-apps): install and test builds on your own device.
- [Troubleshoot Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-troubleshooting): sign-in, agent, and update problems.

Support and legal

English (US)

© 2026 Meta