# Protocols, clients and SDKs

This getting started guide shows you how to get started with EventStoreDB by setting up an instance or cluster and configuring it.

EventStoreDB supports two protocols: gRPC and TCP, described below.

## gRPC protocol 
 
 The gRPC protocol is based on [open standards](https://grpc.io/) and is widely supported by many programming languages. EventStoreDB uses gRPC to communicate between the cluster nodes as well as for client-server communication.
 
 We recommend using gRPC since it is the primary protocol for EventStoreDB moving forward. When developing software that uses EventStoreDB, we recommend using one of the official SDKs.

### EventStoreDB supported clients

- [.NET](https://github.com/EventStore/EventStore-Client-Dotnet)
- [Java](https://github.com/EventStore/EventStoreDB-Client-Java)
- Node

## TCP protocol

EventStoreDB offers a low-level protocol in the form of an asynchronous TCP protocol that exchanges protobuf objects. At present this protocol has adapters for .NET and the JVM.

::: warning
We plan to phase out the TCP protocol in the later versions. Please consider migrating your applications that use the TCP protocol and refactor them to use gRPC instead.
:::

### EventStoreDB supported clients

- [.NET Framework and .NET Core](http://www.nuget.org/packages/EventStore.Client)
- [JVM Client](https://github.com/EventStore/EventStore.JVM)

### Community developed clients

- [Node.js](https://www.npmjs.com/package/event-store-client)
- [Node.js](https://www.npmjs.com/package/ges-client)
- [Node.js](https://github.com/nicdex/eventstore-node)
- [Haskell](https://github.com/YoEight/eventstore)
- [Erlang](https://bitbucket.org/anakryiko/erles)
- [F#](https://github.com/haf/EventStore.Client.FSharp)
- [Elixir](https://github.com/exponentially/extreme)
- [Java 8](https://github.com/msemys/esjc)
- [Maven plugin](https://github.com/fuinorg/event-store-maven-plugin)
- [Rust](https://github.com/YoEight/eventstore-rs)
- [Go](https://github.com/jdextraze/go-gesclient)
- [PHP](https://github.com/prooph/event-store-client/)

## HTTP

EventStoreDB also offers an HTTP-based interface, based specifically on the [AtomPub protocol](http://tools.ietf.org/html/rfc5023). As it operates over HTTP, this is less efficient, but nearly every environment supports it.

### Community developed clients

- [PHP](https://github.com/dbellettini/php-eventstore-client)
- [PHP](https://github.com/prooph/event-store-http-client/)
- [Python](https://github.com/madedotcom/atomicpuppy)
- [Ruby](https://github.com/arkency/http_eventstore)
- [Go](https://github.com/jetbasrawi/go.geteventstore)

