# Release Channels | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/resources/publish-release-channels
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Distribute and grow

Updated: Oct 30, 2026

Release channels let you distribute early versions of your builds to limited audiences for testing or other purposes. You can create public channels for users to subscribe to, or invite different groups of people to private release channels. When you are confident your app is ready for release, you can then copy your build to the Production channel and submit it for app review.

You can upload any build of your app to any release channel using the [Meta VR Developer Hub](https://developers.meta.com/vr/documentation/unity/ts-mqdh/) or the [Oculus Platform Utility](https://developers.meta.com/vr/resources/publish-reference-platform-command-line-utility/). Uploading to a release channel indicates that you are ready to release it to an audience even if that audience is a group of internal testers. Because of this, all uploaded apps, even alpha builds, must meet the release packaging requirements for your platform.

By default, apps come with the following release channels:

- **Production**: This is a public facing release channel. Users who purchase your app through the Meta Horizon Store will be placed on this release channel.
- **RC**: An invite only release channel for your app’s release candidates.
- **BETA**: An invite only release channel for beta testing your app.
- **ALPHA**: An invite only release channel for early alpha testing of your app.

Initially, the Alpha, Beta, and Release Candidate channels are empty and contain no users—not even yourself.
You can:

- Invite users into a channel by email, alias, or URL
- Mark a channel as public, for users to freely subscribe themselves

Apps distributed through release channels appear in the user’s app Library and the **My Preview Apps** section of the Store.

All uploaded apps, even alpha builds, must meet the release packaging requirements for your platform. Uploading an app to a release channel indicates that you are ready to release it to an audience even if that audience is a group of internal testers.

The Production channel does not have subscribers. The name displayed for this channel is **Production (Store)** depending on the type of app. When you place a build in this channel for the first time, nothing happens until after you enter the **Submission Info** and click **Submit for Review** to start the review process. For more information on the review process, see [Preparing for App Review](https://developers.meta.com/vr/resources/publish-app-review/).

After your app is published on the Meta Horizon Store, users can access your app’s product description page by way of a direct URL, or find it with an exact name search in the Store. If your app is a Store app, users can browse and find your app in the Store.

Any new builds of an approved app that you copy to the Production channel trigger an update for all users who are entitled to download the release version of your app. See [Updating a Published App](https://developers.meta.com/vr/resources/publish-content-updating/).

You can view and manage the state of your release channels at any time by viewing the **Release Channels** page for your app:

1. Go to the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select your app.
3. In the left-side navigation, click **Distribution** > **Release Channels**.

If you are a Meta Quest for Business developer, the **Release Channels** page separates release channels into **Business** and **Store** sections. The following image shows an example:

This section provides topics that enable you to complete the following tasks:

- **[Upload Builds to a Release Channel](https://developers.meta.com/vr/resources/publish-release-channels-upload/)**:
Shows you how to upload a build to your release channel.
- **[Add Users to a Release Channel](https://developers.meta.com/vr/resources/publish-release-channels-add-users/)**:
Describes how to make a channel public or invite users to release channels by email. The default user limit is 200, with the option to request up to 2,500.
- **[Copy Builds Between Release Channels](https://developers.meta.com/vr/resources/publish-release-channels-migrate/)**:
Describes how to copy a build to another release channel to expose it to a new set of testers or users.
- **[Support Meta Quest 2 and Meta Quest Pro after v213](https://developers.meta.com/vr/resources/quest-2-quest-pro-legacy-support/)**:
Explains how to maintain one build, maintain separate builds, or end support for these devices.
- **[Add Custom Release Channels](https://developers.meta.com/vr/resources/publish-release-channels-add-custom/)**:
Shows how to create additional release channels if you need more.
- **[Distribution in South Korea](https://developers.meta.com/vr/policy/distribution-in-south-korea/#grac-ratings-requirements)**:
Describes release channels requirements for distributing to testers in South Korea.

Support and legal

English (US)

© 2026 Meta