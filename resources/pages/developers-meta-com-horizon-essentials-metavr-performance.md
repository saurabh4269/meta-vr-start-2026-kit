# Profile and debug performance | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-performance
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Aug 28, 2026

Meta VR CLI (`metavr`) captures Perfetto traces from a device and analyzes them on your machine. It also samples the CPU with simpleperf and pulls memory snapshots off the device. This guide covers the capture and analyze loop, then the other profiling tools.

- Meta VR CLI installed. See [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install).
- Developer Mode on, USB debugging authorized, and a connected device.
- The `perfetto` binary on the device. Capture fails without it.

`metavr tools install perfetto`.
metavr device list

Your device appears in the list. If it does not, fix that before you capture.

metavr perf capture --app com.example.myapp --mode vr --duration 10000

`--duration` is in milliseconds and defaults to 5000. `--mode` takes a preset: `standard` (the default), `gpu`, `cpu`, `memory`, `lightweight`, `full`, `vr`, or `custom`. Add `--launch` to force-stop the app first, so a cold start lands inside the trace.
The command prints the file path, the size, and a **session ID**. Every analysis command takes that session ID.

To name the trace file yourself, pass `--output` (short form `-o`) with a name and no extension:

metavr perf capture --app com.example.myapp --output before-fix

`--output` name overwrites the earlier trace.
To control the capture window yourself, run it in two parts:

metavr perf start --app com.example.myapp --mode vr
metavr perf stop \<PID> \<OUTPUT\_NAME>

`perf start` prints the PID and the output name. `perf stop` needs both.
metavr perf analyze-trace

Omit the session ID and it uses your newest trace. Narrow the report with `--focus`, which takes `overview` (the default), `gpu`, `cpu`, `frames`, or `threads`.

`metavr perf load` exists only as a quick check that a trace parses.
To see what you have captured:

metavr perf traces

Newest first. `-l/--limit <N>` defaults to 10.

Run SQL against the trace:

metavr perf query \<SESSION\_ID> "SELECT \* FROM thread LIMIT 10"

The query returns both a `tid` and a `utid` column. Take the `utid` and look at how that thread spent its time:

metavr perf thread-state \<SESSION\_ID> \<UTID>

You get running, runnable, and sleeping time, covering up to 100 state changes.

For GPU counters, pass matching lists of frame start and end times in nanoseconds:

metavr perf gpu-counters \<SESSION\_ID> --start-ts 1000000,2000000 --end-ts 1500000,2500000

To compare a run against a baseline:

metavr perf compare \<BASELINE\_ID> \<COMPARISON\_ID>

metavr perf open \<SESSION\_ID>

This serves the trace and opens your browser. It waits until the browser fetches the trace, and gives up after three minutes idle.

A Perfetto trace shows where time goes inside a frame. simpleperf answers a different question: why the CPU is slow. It needs the `simpleperf` binary on the device, and your app has to be running already.

metavr perf simpleperf classify --app com.example.myapp

This sorts the workload into CPU-bound, memory-bound, I/O-bound, or mixed, and explains the call. `--duration <SECONDS>` defaults to 10.

metavr perf simpleperf record --app com.example.myapp

This samples the app and lists the hottest functions. `--frequency <HZ>` defaults to 4000.

metavr perf simpleperf kernel-overhead --app com.example.myapp

This splits user and kernel cycles per thread.

metavr perf memory-snapshot --app com.example.myapp

Snapshots land in a `memory-snapshots` folder. Change it with `-o/--output <DIR>`. Name a checkpoint with `--label <LABEL>`. Filenames carry a timestamp, so repeated snapshots never collide.

With the Model Context Protocol (MCP) server connected, you can describe the goal in plain language. Ask your agent to capture a trace of your app and find the slowest frames, and it picks the steps and reports back.

`metavr perf capture` reports that it cannot find the Perfetto binary on the device.`perfetto` present. Confirm the device is in Developer Mode and shows up in `analyze-trace` or `query` sits for a while before printing anything.`metavr perf gpu-counters` returns placeholder values in place of measurements.`--start-ts` and `--end-ts`.
- [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install): install the CLI and connect it to your AI agent.
- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview): how the command line and the MCP server relate.
- [Perfetto guide for Native](https://developers.meta.com/vr/documentation/native/android/ts-perfettoguide/)
- [Perfetto guide for Spatial SDK](https://developers.meta.com/vr/documentation/spatial-sdk/ts-perfettoguide/)
- [Perfetto guide for Unity](https://developers.meta.com/vr/documentation/unity/ts-perfettoguide/)
- [Perfetto guide for Unreal](https://developers.meta.com/vr/documentation/unreal/ts-perfettoguide/)

Support and legal

English (US)

© 2026 Meta