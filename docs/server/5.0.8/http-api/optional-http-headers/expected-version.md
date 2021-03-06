# Expected Version

When you write to a stream you often want to use `Expected Version` to allow for optimistic concurrency with a stream. You commonly use this for a domain object projection.

i.e., "A write can succeed if I have seen everyone else's writes."

You set `ExpectedVersion` with the syntax `ES-ExpectedVersion: #`, where `#` is an integer version number. There are other special values available:

- `0`, the stream should exist but be empty when writing.
- `-1`, the stream should not exist when writing.
- `-2`, the write should not conflict with anything and should always succeed.
- `-4`, the stream or a metadata stream should exist when writing.

If the `ExpectedVersion` does not match the version of the stream, EventStoreDB returns an HTTP 400 `Wrong expected EventNumber` response. This response contains the current version of the stream in an `ES-CurrentVersion` header.

In the following cURL command `ExpectedVersion` is not set, and it appends or create/append to the stream.

:::: tabs
::: tab Request
<<< @/docs/server/5.0.8/http-api/sample-code/write-event.sh#curl
:::
::: tab Response
<<< @/docs/server/5.0.8/http-api/sample-code/write-event.sh#response
:::
::::

The stream `newstream` has one event. If you append with an expected version of `3`, you receive an error.

:::: tabs
::: tab Request
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-wrong-version.sh#curl
:::
::: tab Response
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-wrong-version.sh#response
:::
::::

You can see from the `ES-CurrentVersion` header above that the stream is at version 0. Appending with an expected version of 0 works. The expected version is always the version of the last event known in the stream.

:::: tabs
::: tab Request
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-version.sh#curl
:::
::: tab Response
<<< @/docs/server/5.0.8/http-api/sample-code/write-event-version.sh#response
:::
::::
