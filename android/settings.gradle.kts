pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
        maven { url = uri("https://jitpack.io") } // JitPack repository
    }
}
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }

        maven { setUrl("https://jitpack.io") }
        maven {
            url = uri("https://jfrog.anythinktech.com/artifactory/overseas_sdk")
        }
        maven {
            url = uri("https://jfrog.anythinktech.com/artifactory/debugger")
        }
        maven { url = uri("https://artifacts.applovin.com/android") }

    }
}
rootProject.name = "DramaShort"
include(":app")
 