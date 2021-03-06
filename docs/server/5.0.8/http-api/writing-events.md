# Writing Events

You write to a stream over HTTP using a `POST` request to the resource of the stream. If the stream does not exist then the stream is implicitly created.

## EventStoreDB media types

EventStoreDB supports a custom media type for posting events, `application/vnd.eventstore.events+json` or `application/vnd.eventstore.events+xml`. This format allows for extra functionality that posting events as `application/json` or `application/xml` does not. For example it allows you to post multiple events in a single batch.

<!-- TODO: And more? Why not use it? And why are these examples not using it? -->

The format represents data with the following jschema (`eventId` must be a UUID).

```json
[
    {
      "eventId"    : "string",
      "eventType"  : "string",
      "data"       : "object",
      "metadata"   : "object"
    }
]
```

## Writing a single event

If you issue a `POST` request with data to a stream and the correct content type set it writes the event to the stream, and generates a `201` response from the server, giving you the location of the event. Using the following event, which [you can also download as a file](sample-code/event.json):

<<< @/docs/server/5.0.8/http-api/sample-code/event.json

`POST` the following request to create a stream and add an event to it:

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event.sh#response
:::
::::

Some clients may not be able to generate a unique identifier (or may not want to) for the event ID. You need this ID for idempotence purposes and EventStoreDB can generate it for you.

If you leave off the `ES-EventId` header you see different behavior:

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-no-id.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-no-id.sh#response
:::
::::

In this case EventStoreDB has responded with a `307 Temporary Redirect`. The location points to another URI that you can post the event to. This new URI is idempotent for posting, even without an event ID.

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-follow.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-follow.sh#response
:::
::::

It's generally recommended to include an event ID if possible as it results in fewer round trips between the client and the server.

When posting to either the stream or to the returned redirect, clients must include the `EventType` header. If you forget to include the header you receive an error.

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-no-type.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-no-type.sh#response
:::
::::

## Batch writes

You can include more than one write in a single post by placing multiple events inside of the array representing the events, including metadata.

For example, the below has two events:

<<< @/docs/server/5.0.8/http-api/sample-code/multiple-events.json

When you write multiple events in a single post, EventStoreDB treats them as one transaction, it writes all events together or fails.

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-multiple-events.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-multiple-events.sh#response
:::
::::

### Appending events

To append events, issue a `POST` request to the same resource with a new `eventId`:

<<< @/docs/server/5.0.8/http-api/sample-code/event-append.json

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-append.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-append.sh#response
:::
::::

## Data-only events

Version 3.7.0 of EventStoreDB added support for the `application/octet-stream` content type to support data-only binary events. When creating these events, you need to provide the `ES-EventType` and `ES-EventId` headers and cannot have metadata associated with the event. In the example below `SGVsbG8gV29ybGQ=` is the data you `POST` to the stream:

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-data-event.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-data-event.sh#response
:::
::::

## Expected version header

The expected version header represents the version of the stream you expect.

For example if you write to a stream at version 1, then you expect it to be at version 1 next time you write. This can allow for optimistic locking when multiple applications are reading/writing to streams.

If your expected version is not the current version you receive an HTTP status code of 400.

::: warning
See the idempotence section below, if you post the same event twice it is idempotent and won't return a version error.
:::

First write an event to a stream, setting a version:

<<< @/docs/server/5.0.8/http-api/sample-code/event-version.json

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-version.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-version.sh#response
:::
::::

If you now write to the stream with the incorrect version, you receive an HTTP status code 400 error.

:::: el-tabs type="border-card"
::: el-tab-pane label="Request"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-wrong-version.sh#curl
:::
::: el-tab-pane label="Response"
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-wrong-version.sh#response
:::
::::

There are special values you can use in the expected version header:

-   `-2` states that this write should never conflict and should **always** succeed.
-   `-1` states that the stream should not exist at the time of the writing (this write creates it).
-   `0` states that the stream should exist but should be empty.

## Idempotence

Appends to streams are idempotent based upon the `EventId` assigned in your post. If you were to re-run the last command it returns the same value again.

This is important behaviour as it's how you implement error handling. If you receive a timeout, broken connection, no answer, etc from your HTTP `POST` then it's your responsibility to retry the post. You must also keep the same UUID that you assigned to the event in the first `POST`.

If you are using the expected version parameter with your post, then EventStoreDB is 100% idempotent. If you use `-2` as your expected version value, EventStoreDB does its best to keep events idempotent but cannot assure that everything is fully idempotent and you end up in 'at-least-once' messaging. [Read this guide](optimistic-concurrency-and-idempotence.md) for more details on idempotence.
