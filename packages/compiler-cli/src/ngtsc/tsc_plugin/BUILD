package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "tsc_plugin_lib",
    srcs = ["tsc_plugin.ts"],
    deps = [
      "@ngdeps//typescript",
      "@ngdeps//@bazel/typescript",
    ]
)
load("@build_bazel_rules_typescript//internal:tsc_plugin.bzl", "tsc_plugin")

tsc_plugin(
    name = "tsc_plugin",
    entry_point = ":tsc_plugin.ts",
    deps = [":tsc_plugin_lib"],
)
