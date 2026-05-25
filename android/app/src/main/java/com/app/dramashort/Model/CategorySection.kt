package com.app.dramashort.Model

import android.os.Parcelable
import androidx.annotation.Keep
import kotlinx.parcelize.Parcelize
@Keep
@Parcelize
data class CategorySection(
    val title: String,
    val icon: Int,
    val items: List<CommonInfo>,
) : Parcelable