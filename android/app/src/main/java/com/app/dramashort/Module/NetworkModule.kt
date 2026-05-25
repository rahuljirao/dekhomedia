package com.app.dramashort.Module

import android.util.Log
import com.app.dramashort.APIs.ApiService
import com.app.dramashort.APIs.ContentTypeInterceptor
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Utils.AdminPreference
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton
import kotlin.jvm.java

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    private const val TIMEOUT_CONNECT: Long = 10
    private const val TIMEOUT_READ: Long = 30
    private const val TIMEOUT_WRITE: Long = 30

    @Provides
    @Named("BaseUrl")
    fun provideBaseUrl(): String = com.app.dramashort.BuildConfig.BASE_URL

    @Provides
    @Singleton
    fun provideCertificatePinner(
        @Named("BaseUrl") baseUrl: String
    ): CertificatePinner {

        val host = try {
            java.net.URI(baseUrl).host ?: ""
        } catch (e: Exception) {
            Log.e("NetworkModule","provideCertificatePinner Exception : $e")
            ""
        }
        return try {
            CertificatePinner.Builder()
                .add(host, com.app.dramashort.BuildConfig.SHA_256)
                .build()
        } catch (e: IllegalArgumentException) {
            Log.e("NetworkModule","IllegalArgumentException : $e")
            CertificatePinner.Builder()
                .add(host)
                .build()
        }

    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        certificatePinner: CertificatePinner
    ): OkHttpClient {
        val token = AdminPreference(ReelShortApp.instance).authToken

        return OkHttpClient.Builder()
            .certificatePinner(certificatePinner)
            .connectTimeout(TIMEOUT_CONNECT, TimeUnit.SECONDS)
            .readTimeout(TIMEOUT_READ, TimeUnit.SECONDS)
            .writeTimeout(TIMEOUT_WRITE, TimeUnit.SECONDS)
            .addInterceptor(ContentTypeInterceptor("application/json", token))
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient,
        @Named("BaseUrl") baseUrl: String
    ): Retrofit = Retrofit.Builder()
        .baseUrl(baseUrl)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttpClient)
        .build()

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
