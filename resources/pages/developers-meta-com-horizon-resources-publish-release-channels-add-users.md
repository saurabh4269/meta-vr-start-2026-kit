# Add users to a release channel | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/resources/publish-release-channels-add-users/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Distribute and grow

Updated: Oct 29, 2026

Developers can use different release channels to test new features with specific audiences, or for pre-release testing.

- **Public release channels** are always discoverable by users who purchased your app, who can self-subscribe to the channel. You can use this for public betas of your app.
- **Invite-only release channels** are only discoverable by users who receive email invites, or access an invite URL. Use this feature for pre-release tests, or when you want to be selective about who is testing your app.

If a user has access to multiple release channels, they can change the active channel by visiting the applications’ “Settings” page in-headset, or via the version dropdown in the application’s Meta Horizon Store page out-of-headset.

You can use public opt-in channels to release public betas of your app for anyone who has purchased your app. Users must be at least 13 years of age to use public channels.

To make a release channel public:

- When you create a new release channel, select the **Public** option in Channel Access.
- For a channel you have already created, or a predefined channel, edit the channel by clicking the channel name to display its page. Select the **Channel Settings** tab and select **Public** in Channel Access.

Keep the following limitations in mind when using public release channels:

- Users can only leave reviews if they are on the public release channel. Users on other channels will not be able to leave app reviews.
- Public channels are only visible to users who already have access to your application. For example, if your app is not yet published, uploading a build to a public release channel will not make it public to all users.

To distribute your release channel builds to a select group of users, you must first invite the users to a private release channel by email or URL invite.

Users must be at least 18 years of age to be invited to private channels. If the user resides in South Korea, your app must have a non-mature GRAC rating.

To make a release channel private:

- When you create a new release channel, select the **Private** option in Channel Access.
- For a channel you have already created, or a predefined channel, edit the channel by clicking the channel name to display its page. Select the **Channel Settings** tab and select **Private** in Channel Access.

Users receive updated builds as long as they remain a member of that channel. Users will no longer receive app updates to the channel when they are removed from the channel or when the channel is deleted.

Users invited to a private channel will have access to public channels in your application as well. For instance, if you are doing pre-release testing for your application via private release channels, you may want to remove all users from that private release channel before you launch, or else those users will have access to your public launch builds.

1. Go to the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select your app.
3. In the left-side navigation, click**Distribution** > **Release Channels**.A list of release channels appears.
4. In the**Users** column of the desired release channel, click the number.If there are any users, a list of users appears. If there aren’t any users, the page states, “No users”.
5. Click **Email Invite Users** and enter the email addresses of the users you want to invite to this channel. Enter email addresses separated by commas, up to the channel’s user limit.
6. Read the consent and select the **I agree** checkbox.
7. Click**Send Invite**.The system then sends email invitations to each user you have invited.

In addition to email invites, which are always enabled, the Release Channel URL feature lets you easily share an invite URL with your audience. The feature also allows you to choose between individual or bulk approving/denying each person who tries join the release channel to access your build.

When users click on the URL, they will be taken to a page with details populated from your app submission metadata (app name, description, and header image). Users can join or request to join the channel depending on the join mode you set. After joining from a computer or phone, users can select **Install on headset** on that page to install the build on their device.

To create an app, a release channel, and its invite URL in one step from the command line, see \[Share a build with a link\](https://developers.meta.com/essentials/metavr-share-builds).

How to set up an invite URL:

1. Go to the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select your app.
3. In the left-side navigation, click**Distribution** > **Release Channels**.A list of release channels appears.
4. In the**Name** column, click the channel name.
5. Click the **Channel Settings** tab.
6. In the**Channel Invite** section, select the box to **Grant access to users by URL**.The system will then generate a link. Using the buttons to the right of the link, you can copy the link or change it. The header app image on the URL page and app description will be used from the one uploaded to your App Submission -> App Metadata. You do not have to submit the app to save the image or app description.
7. Select your approval choice:
    
  - Automatic approval: Users with this URL will be automatically added to the release channel up to the max limit.
  - Manual Approval: Users with this URL will need admin approval before being added to this release channel. Org members with the **Manage Release Channels** permission for the app will be emailed when a user requests to join. Org admins have this permission by default. Users will be emailed when you approve their request.
8. The Channel User Limit is set to 200 by default. You can increase the limit to 2,500 users by enabling higher channel limits directly in your channel settings—no approval request is required. Enabling higher limits is a permanent, per-app decision that applies to all release channels for that app and causes all future Data Use Checkups for the app to require manual review. If your app already has a provisional Data Use Checkup, the increase to 2,500 will not take effect until that Data Use Checkup is manually reviewed and approved. After the limit is reached, non-members will be unable to access the release channel URL page. Test users created on your team are excluded from this user limit.
9. Click **Save Changes** in the bottom right corner.

The invite URL page will be disabled 90 days after your latest build upload date to the given channel, so you will need to upload a new version to the release channel in order to re-enable the URL invite page for new users.

You can also disable the channel invite link at any time by unchecking **Grant access to users by URL**. This will 404 the invite URL page and prevent users from joining by URL. You can re-enable the same invite URL at any time by re-checking the checkbox and saving changes.

You can change the invite URL at any time by clicking **Change URL** and saving changes.

Changing the URL will break any previously shared invite URLs.

You may remove or block users from the release channel, which will prevent users from receiving future builds uploaded to this channel. Users that are removed can be re-added using the invite URL. Users that are blocked cannot be re-added. You can unblock users from joining at any time.

You can manage the release channel’s users in the **Users** tab:

- **Joined** lists the users who have access to the build uploaded to the channel.
- **Invited** lists the users who have not yet accepted your email invitation.
- **Pending Approval** lists the users who have requested to join the channel by URL and are awaiting your approval.
- **Blocked** lists the users who you have removed and prevented from re-joining the channel. You can unblock the user from joining at anytime.

Users in release channels other than “Production (Store)” can submit playtesting feedback in-headset. Playtesting feedback may include screen captures, recordings, and text that can provide you with contextual information which you can use to improve your app’s user experience.

To view the feedback your app’s users have submitted, visit the Developer Dashboard and click on the Playtesting Feedback page within the App Manager.

Playtesting feedback also appears on the Bug reports page, together with bug reports from players of your public release. For more information, see [Bug reports](https://developers.meta.com/vr/resources/bug-reports/).

We recommend sharing these best practices with your release channel audience to help them submit consistent feedback that’s valuable and actionable for your team.

If your app includes in-app purchases or subscriptions, use [test users](https://developers.meta.com/vr/resources/test-users/) to verify payment flows on your Alpha, Beta, or RC channels. Test users can complete purchases and validate entitlements without incurring real charges. Set up test users before inviting your testing audience to ensure your monetization flows work correctly before submission.

Users get the highest build version available to them by default. For example, say a user has purchased your app and is part of the following channels:

- Alpha: build 55
- Beta: build 67
- Production: build 44

This user would receive build 67, as that is the highest build version. They can override this default by visiting the applications’ “Settings” page in-headset, or via the version dropdown in the application’s Meta Horizon Store page out-of-headset.

Support and legal

English (US)

© 2026 Meta