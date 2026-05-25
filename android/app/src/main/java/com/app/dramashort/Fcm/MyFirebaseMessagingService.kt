package com.app.dramashort.Fcm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.app.dramashort.R
import com.app.dramashort.UI.Activity.SplashActivity
import com.bumptech.glide.Glide
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {

        Log.e("MyFirebaseMessagingService", "onMessageReceived: " + remoteMessage.notification)

//        // Handle notification
//        remoteMessage.notification?.let {
//            val title = it.title
//            val body = it.body
//            showNotification(this, title, body)
//        }

        remoteMessage.notification?.let {
            val title = remoteMessage.data["title"]
            val body = remoteMessage.data["body"]
            val imageUrl = remoteMessage.data["imageUrl"] // or use remoteMessage.notification?.imageUrl
            Log.e("TAG", "onMessageReceived: $imageUrl")
            if (!imageUrl.isNullOrEmpty()) {
                showNotification(title, body, imageUrl)
            } else {
                showNotification(title, body, null)
            }
        }


    }

    private fun getBitmapFromUrl(imageUrl: String): Bitmap? {
        return try {
            Glide.with(this)
                .asBitmap()
                .load(imageUrl)
                .submit() // this returns a FutureTarget
                .get() // blocks until the image is loaded
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }


    private fun showNotification(title: String?, body: String?, imageUrl: String?) {


        val notificationManager = getSystemService(NotificationManager::class.java)

        val notificationIntent = Intent(this, SplashActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val bitmap = if (imageUrl != null) {
            getBitmapFromUrl(imageUrl)
        } else {
            BitmapFactory.decodeResource(resources, R.mipmap.ic_launcher)
        }


        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(
                R.mipmap.ic_launcher
            )
            .setStyle(NotificationCompat.BigPictureStyle().bigPicture(bitmap))
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        createNotificationChannel(this)
        notificationManager.notify(0, notification)
    }


    companion object{
        val NOTIFICATION_CHANNEL = "Timer Notifications"
        val CHANNEL_ID = "timer_notification_channel_12121"

        fun createNotificationChannel(context: Context) {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val name = NOTIFICATION_CHANNEL
                val descriptionText = "Notifications for timer completion"
                val importance = NotificationManager.IMPORTANCE_HIGH

                val soundUri = Uri.parse("android.resource://${context.packageName}/raw/mining_complete")

                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()

                val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                    description = descriptionText
                    setSound(soundUri, audioAttributes)
                }

                val notificationManager = context.getSystemService(NotificationManager::class.java)
                notificationManager.createNotificationChannel(channel)
                Log.e("TAG", "createNotificationChannel: ")
            }
        }
    }

}