package com.app.dramashort.Premium

enum class TaskStatus(val code: Int, val description: String) {
    PENDING(0, "Pending"),
    IN_PROCESS(1, "In Process"),
    SUCCESS(2, "Success"),
    FAILURE(3, "Failure");
    companion object {
        fun fromCode(code: Int): TaskStatus? = values().find { it.code == code }
    }
}