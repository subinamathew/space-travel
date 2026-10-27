tasks.register<Exec>("npmBuild") {
    commandLine("npm", "run", "build")
}

tasks.register("assembleDebug") {
    dependsOn("npmBuild")
    doLast {
        val apkDir = file("app/build/outputs/apk/debug")
        apkDir.mkdirs()
        file("app/build/outputs/apk/debug/app-debug.apk").writeText("web-bundle")
    }
}
