package com.app.dramashort.ViewModel

import androidx.annotation.Keep

@Keep
sealed class ApiResult<out T> {
    @Keep
    data class Success<out T>(val data: T) : ApiResult<T>()

    @Keep
    data class Error(
        val code: UserRepository.HttpCode,
        val rawCode: Int = -1,
        val message: String,
    ) : ApiResult<Nothing>()
}
