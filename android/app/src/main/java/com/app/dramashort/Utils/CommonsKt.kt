package com.app.dramashort.Utils

import android.app.Activity
import android.app.Activity.RESULT_OK
import android.app.Dialog
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.CountDownTimer
import android.view.LayoutInflater
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.annotation.OptIn
import androidx.core.content.FileProvider
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.util.UnstableApi
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.exoplayer.source.MediaSource
import androidx.media3.exoplayer.source.ProgressiveMediaSource
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.CommonInfo
import com.app.dramashort.Model.CommonInfoBase
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.Model.CommonInfoReelBase
import com.app.dramashort.R
import com.app.dramashort.databinding.DialogConfirmationBinding
import com.app.dramashort.databinding.DialogCongratulationsBinding
import com.app.dramashort.databinding.DialogCongratulationsVipBinding
import com.app.dramashort.databinding.DialogServerErrorBinding
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.CustomTarget
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.collections.filterNotNull
import kotlin.collections.mapIndexed


object CommonsKt {
    private const val TAG = "***Utility***"
    const val HOME_PAGE_SIZE = 10
    const val HOME_MY_FRAGMENT = 3
    const val EPISODE_SPLIT_SIZE = 30
    const val LOCK_EPISODE_INDEX = 3
    const val WATCH_ADS_FOR_EPISODE = 3
    const val url = 10
    const val SERIES_TITLE_EXTRA = "SERIES_TITLE_EXTRA"
    const val SERIES_ID_EXTRA = "SERIES_ID_EXTRA"
    const val EPISODE_ID_EXTRA = "EPISODE_ID_EXTRA"
    const val POSITION_EXTRA = "POSITION_EXTRA"


    const val PLAN_ID_EXTRA = "PLAN_ID_EXTRA"
    const val GETAWAY_ID_EXTRA = "GETAWAY_ID_EXTRA"
    const val CURRENCY_EXTRA = "CURRENCY_EXTRA"


    const val URL_EXTRA = "URL_EXTRA"
    const val TITLE_EXTRA = "TITLE_EXTRA"

    //for fozor pay
    const val PAYMENT_KEY_EXTRA = "PAYMENT_KEY_EXTRA"

    //for Stripe
    const val PAYMENT_AMOUNT_EXTRA = "PAYMENT_AMOUNT_EXTRA"
    const val TRANSACTION_ID_EXTRA = "TRANSACTION_ID_EXTRA"
    var LAST_INDEX: Int? = null

//    var reels: List<CommonInfoReel>? = null

    @OptIn(UnstableApi::class)
    fun buildHlsMediaSource(url: String): MediaSource {
        val mediaItem = MediaItem.Builder()
            .setUri(url)
            .setMimeType(MimeTypes.APPLICATION_M3U8)
            .build()

        return HlsMediaSource.Factory(
            DefaultHttpDataSource.Factory().setAllowCrossProtocolRedirects(true)
        ).createMediaSource(mediaItem)
    }

    @OptIn(UnstableApi::class)
    fun buildProgressiveMediaSource(url: String): MediaSource {
        return ProgressiveMediaSource.Factory(DefaultHttpDataSource.Factory())
            .createMediaSource(
                MediaItem.Builder()
                    .setUri(url)
                    .build()
            )
    }

    fun openBrowser(context: Context, url: String, callback: () -> Unit = {}) {
        try {
            context.startActivity(
                Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(url)
                )
            )
            callback
        } catch (e: ActivityNotFoundException) {
            callback
        }
    }

    fun openBrowser(
        url: String,
        launcher: ActivityResultLauncher<Intent>,
    ) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            launcher.launch(intent)
        } catch (e: ActivityNotFoundException) {
        }
    }


    fun String.capitalizeFirstLetter(): String =
        this.trim().lowercase(Locale.ROOT).replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }


    fun <T : CommonInfoReelBase> getCommonInfoReel(
        allEpisodes: List<T?>,
        lockFromIndex: Int = LOCK_EPISODE_INDEX,
    ): List<CommonInfoReel> {
        return allEpisodes.filterNotNull().mapIndexed { index, episode ->
            CommonInfoReel(
                id = episode.id,
                title = episode.title,
                tagsName = episode.tagsName,
                views = episode.views,
                thumbnail = episode.thumbnail,
                description = episode.description,
                videoUrl = episode.videoUrl,
                seriesId = episode.seriesId,
                episodeNumber = episode.episodeNumber,
                freeEpisodes = episode.freeEpisodes,
                thumbnailUrl = episode.thumbnailUrl,
                categoryName = episode.categoryName,
                coverVideo = episode.coverVideo,
                poster = episode.poster,
//                isLocked = index >= lockFromIndex,
                isLocked = episode.isLocked.asBoolean,
                requiredCoin = episode.coin,

                isLiked = episode.isLiked,
                likedCount = episode.likedCount,

                isFavourites = episode.isFavourites,
                favouritesCount = episode.favouritesCount,


                isAutoUnlocked = episode.isAutoUnlocked,
            )
        }
    }


    fun <T : CommonInfoBase> getCommonInfo(allEpisodes: List<T?>): List<CommonInfo> {
        return allEpisodes.filterNotNull().map { episode ->
            CommonInfo(
                id = episode.id,
                title = episode.title,
                tagsName = episode.tagsName,
                views = episode.views,
                thumbnail = episode.thumbnail,
                description = episode.description,
                isLiked = episode.isLiked,
                coverVideo = episode.coverVideo,
                poster = episode.poster,
                categoryName = episode.categoryName,
                isFavourites = episode.isFavourites,
                thumbnailUrl = episode.thumbnailUrl,
                isLocked = episode.isLocked.asBoolean,
                isFree = episode.isFree
            )
        }
    }


    fun shareApp(context: Context) {
        try {
            val intent = Intent("android.intent.action.SEND")
            intent.apply {
                setType("text/plain")
                putExtra(
                    "android.intent.extra.TEXT",
                    (context.getString(R.string.app_name) + " :")
                            + "\n" + ("https://play.google.com/store/apps/details?id="
                            + context.packageName)
                )
            }
            context.startActivity(Intent.createChooser(intent, "Share via"))
        } catch (e: Exception) {
//            e.printStackTrace()
        }
    }


    //    private const val LOCK_DURATION = 24 * 60 * 60 * 1000L // 24 hours in milliseconds
    private const val LOCK_DURATION = 60 * 1000L // 1 minit in milliseconds
//     val LOCK_DURATION = TimeUnit.HOURS.toMillis(24) // 24 hours in milliseconds

//    fun adsLockedFor24Hours(duration:Long, pref: AdminPreference = AdminPreference(ReelShortApp.instance)): Boolean {
//        val lockTimestamp = pref.adsLockTimeStamp - duration
//        if (lockTimestamp == 0L) return false // No lock set
//        if (lockTimestamp == 0L) return false // No lock set
//        val currentTime = System.currentTimeMillis()
//        return (currentTime - lockTimestamp) < duration
//    }

    fun timeToMillis(timeString: String, pref: AdminPreference = AdminPreference(ReelShortApp.instance)): Long {
//        val currentTime = System.currentTimeMillis()
//       val  difrance =  currentTime - pref.adsLockTimeStamp
//        val temp  = difrance + ((1 * 60) * 1000)
//        return temp

//        val temp  = "00:30:00"
        val parts = timeString.split(":").map { it.toInt() }
        val hours = parts.getOrNull(0) ?: 0
        val minutes = parts.getOrNull(1) ?: 0
        val seconds = parts.getOrNull(2) ?: 0

        return ((hours * 3600) + (minutes * 60) + seconds) * 1000L
    }

    private var currentCountdownTimer: CountDownTimer? = null

    fun startAdsCountdown(duration: Long, onTick: (String) -> Unit, onFinish: () -> Unit) {
        // Cancel any existing countdown
        currentCountdownTimer?.cancel()

        val endTime = System.currentTimeMillis() + duration
        val remaining = endTime - System.currentTimeMillis()

        if (remaining <= 0) {
            onTick("00:00:00")
            return
        }

        currentCountdownTimer = object : CountDownTimer(remaining, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val hours = millisUntilFinished / (1000 * 60 * 60)
                val minutes = (millisUntilFinished / (1000 * 60)) % 60
                val seconds = (millisUntilFinished / 1000) % 60
                onTick(String.format("%02d:%02d:%02d", hours, minutes, seconds))
            }

            override fun onFinish() {
                onTick("00:00:00")
                onFinish()
            }
        }.start()
    }


    var currentCountdownTimer2: CountDownTimer? = null
    fun startAdsCountdown2(duration: Long, onTick: (String) -> Unit, onFinish: () -> Unit) {
        // Cancel any existing countdown
        currentCountdownTimer2?.cancel()

        val endTime = System.currentTimeMillis() + duration
        val remaining = endTime - System.currentTimeMillis()

        if (remaining <= 0) {
            onTick("00:00:00")
            return
        }

        currentCountdownTimer2 = object : CountDownTimer(remaining, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val hours = millisUntilFinished / (1000 * 60 * 60)
                val minutes = (millisUntilFinished / (1000 * 60)) % 60
                val seconds = (millisUntilFinished / 1000) % 60
                onTick(String.format("%02d:%02d:%02d", hours, minutes, seconds))
            }

            override fun onFinish() {
                onTick("00:00:00")
                onFinish()
            }
        }.start()
    }

    var currentCountdownTimer3: CountDownTimer? = null
    fun startAdsCountdown3(duration: Long, onTick: (String) -> Unit, onFinish: () -> Unit) {
        // Cancel any existing countdown
        currentCountdownTimer3?.cancel()

        val endTime = System.currentTimeMillis() + duration
        val remaining = endTime - System.currentTimeMillis()

        if (remaining <= 0) {
            onTick("00:00:00")
            return
        }

        currentCountdownTimer3 = object : CountDownTimer(remaining, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val hours = millisUntilFinished / (1000 * 60 * 60)
                val minutes = (millisUntilFinished / (1000 * 60)) % 60
                val seconds = (millisUntilFinished / 1000) % 60
                onTick(String.format("%02d:%02d:%02d", hours, minutes, seconds))
            }

            override fun onFinish() {
                onTick("00:00:00")
                onFinish()
            }
        }.start()
    }



    fun isDatePassed(dateString: String): Boolean {
        try {
            // Parse the ISO 8601 date string
            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val inputDate: Date = sdf.parse(dateString) ?: return false
            // Get Calendar instances
            val inputCalendar = Calendar.getInstance().apply { time = inputDate }
            val currentCalendar = Calendar.getInstance()
            // Compare dates
            return inputCalendar.before(currentCalendar)
        } catch (e: Exception) {
//            e.printStackTrace()
            return false
        }
    }

    fun isTodayDate(dateString: String): Boolean {
        val utcFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        utcFormat.timeZone = TimeZone.getTimeZone("UTC")
        val date = utcFormat.parse(dateString) ?: return false
        val localCalendar = Calendar.getInstance()
        val inputCalendar = Calendar.getInstance().apply { time = date }
        return localCalendar.get(Calendar.YEAR) == inputCalendar.get(Calendar.YEAR)
                &&
                localCalendar.get(Calendar.DAY_OF_YEAR) == inputCalendar.get(Calendar.DAY_OF_YEAR)
    }


    @JvmStatic
    fun openAppInPlayStore(context: Context) {
        val appUrl = "https://play.google.com/store/apps/details?id=${context.packageName}"
        try {
            // First try with Play Store app
            Intent(Intent.ACTION_VIEW).run {
                data = Uri.parse(appUrl)
                setPackage("com.android.vending")
                context.startActivity(this)
            }
        } catch (e: ActivityNotFoundException) {
//            logException(e)
            // Fallback to browser if Play Store not installed
            try {
                Intent(Intent.ACTION_VIEW).run {
                    data = Uri.parse(appUrl)
                    context.startActivity(this)
                }
            } catch (e: Exception) {
//                logException(e, "Couldn't open Play Store")
                // Handle case where no browser is available
                Toast.makeText(context, "Couldn't open Play Store", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun showCongratulationsDialog(activity: Activity, coin: Int) {
        val dialog = Dialog(activity)
        val binding = DialogCongratulationsBinding.inflate(activity.layoutInflater)
        dialog.setContentView(binding.root)
        dialog.setCancelable(false) // Prevent dismissing by clicking outside
        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
        binding.tvMessage.text = "You earned $coin coins!"
        binding.btnOk.setOnClickListener {
            dialog.dismiss()
        }
        dialog.show()
    }

    fun showCongratulationsDialogVip(activity: Activity) {
        val dialog = Dialog(activity)
        val binding = DialogCongratulationsVipBinding.inflate(activity.layoutInflater)
        dialog.setContentView(binding.root)
        dialog.setCancelable(false) // Prevent dismissing by clicking outside
        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
        binding.startWatchingButton.setOnClickListener {
            dialog.dismiss()
            val resultIntent = Intent().apply {
                putExtra("isPaymentSuccess", true)
            }
            activity.setResult(RESULT_OK, resultIntent)
            activity.finish()
        }
        dialog.show()
    }


    fun Int.formatNumber(): String {
        val num = this.toDouble()
        return when {
            num >= 1_000_000_000 -> String.format("%.1fB", num / 1_000_000_000)
            num >= 1_000_000 -> String.format("%.1fM", num / 1_000_000)
            num >= 1_000 -> String.format("%.1fK", num / 1_000)
            else -> this.toString()
        }
    }

    fun showConfirmationDialog(
        activity: Activity,
        message: String = "Are you sure want to remove?",
        subMessage: String = "",
        callback: () -> Unit = {},
    ) {
        val dialog = Dialog(activity)
        val binding = DialogConfirmationBinding.inflate(activity.layoutInflater)
        dialog.setContentView(binding.root)
        dialog.setCancelable(false) // Prevent dismissing by clicking outside
        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        binding.message.text = message
        binding.subMessage.text = subMessage

        if (subMessage.isEmpty()) {
            binding.subMessage.gone()
        }
        binding.ok.setOnClickListener {
            dialog.dismiss()
            callback()
        }
        binding.cancel.setOnClickListener {
            dialog.dismiss()
        }
        dialog.show()
    }

    var dialog: Dialog? = null
    fun showServerErrorDialog(
        activity: Context,
        message: String = "Are you sure want to remove?",
        subMessage: String = "",
        callback: () -> Unit = {},
    ) {
        dialog?.let {
            if (it.isShowing) {
                it.dismiss()
            }
        }
        dialog = Dialog(activity)
        val binding = DialogServerErrorBinding.inflate(LayoutInflater.from(activity))
        dialog!!.setContentView(binding.root)
        dialog!!.setCancelable(false) // Prevent dismissing by clicking outside
        dialog!!.window?.setBackgroundDrawableResource(android.R.color.transparent)

        binding.message.text = message
        binding.subMessage.text = subMessage

        if (subMessage.isEmpty()) {
            binding.subMessage.gone()
        }
        binding.btnOk.setOnClickListener {
            callback()
        }
        dialog!!.show()
    }


    private var adLoadingDialog: Dialog? = null



    fun isOnline(context: Context): Boolean {
        val connectivityManager =
            context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                ?: return false

        val network = connectivityManager.activeNetwork ?: return false
        val networkCapabilities =
            connectivityManager.getNetworkCapabilities(network) ?: return false

        return networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || networkCapabilities.hasTransport(
            NetworkCapabilities.TRANSPORT_CELLULAR
        ) || networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
    }


    fun printLog(tag: String, message: String) {
    }



    fun shareContent(
        context: Context,
        posterUrl: String,
        name: String,
        description: String,
        url: String
    ) {
        Glide.with(context)
            .asBitmap()
            .load(posterUrl)
            .into(object : CustomTarget<Bitmap>() {
                override fun onResourceReady(
                    resource: Bitmap,
                    transition: com.bumptech.glide.request.transition.Transition<in Bitmap>?,
                ) {
                    try {
                        // Save bitmap to cache
                        val cachePath = File(context.cacheDir, "shared_images")
                        cachePath.mkdirs()
                        val file = File(cachePath, "poster.png")
                        FileOutputStream(file).use { out ->
                            resource.compress(Bitmap.CompressFormat.PNG, 100, out)
                        }
                        // Get content URI using FileProvider
                        val uri = FileProvider.getUriForFile(
                            context,
                            "${context.packageName}.provider",
                            file
                        )
                        // Build share intent
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "image/*"
                            putExtra(Intent.EXTRA_STREAM, uri)
                            putExtra(
                                Intent.EXTRA_TEXT,
                                "$name\n\n$description\n\nWatch now 👉 $url"
                            )
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }

                        context.startActivity(Intent.createChooser(shareIntent, "Share via"))

                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }

                override fun onLoadCleared(placeholder: Drawable?) {

                }
            })
    }

}