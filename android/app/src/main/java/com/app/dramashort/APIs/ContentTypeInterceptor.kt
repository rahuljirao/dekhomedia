package com.app.dramashort.APIs

import okhttp3.Interceptor
import okhttp3.Request
import okhttp3.Response

class ContentTypeInterceptor(private val contextType: String, private val authToken: String) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {


        val originalRequest = chain.request()
        val newRequest: Request = originalRequest.newBuilder()
            .header("Content-Type", contextType)
            .method(originalRequest.method, originalRequest.body)
            .build()
        return chain.proceed(newRequest)
    }
}