package com.app.dramashort.UI.Adapter

import android.app.AlertDialog
import android.content.Intent
import android.media.MediaCodec.VIDEO_SCALING_MODE_SCALE_TO_FIT
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.ActivityResultLauncher
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.exoplayer.source.MediaSource
import androidx.media3.exoplayer.source.ProgressiveMediaSource
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.Model.HLSVideoUrlRequest
import com.app.dramashort.R
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.UI.Activity.SeriesInfoActivity
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.CommonsKt.formatNumber
import com.app.dramashort.Utils.CommonsKt.url
import com.app.dramashort.Utils.isNotNegative
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ItemReelBinding
import com.bumptech.glide.Glide
import kotlinx.coroutines.runBlocking


@UnstableApi
class ReelsAdapter(
    private val reelsActivity: ReelsActivity,
    var reels: List<CommonInfoReel>,
    private var isSeries: Boolean,
    private var isMuted: Boolean,
    val infoLauncher: ActivityResultLauncher<Intent>,
    private val onLikeChangeListener: (Int, CommonInfoReel) -> Unit,
    private val onSetFavouriteListener: (Int, CommonInfoReel) -> Unit,
    private val onMuteChangeListener: (Boolean) -> Unit,
    private val onClickMoreEpisodeListener: (Int) -> Unit,
    private val onShowPaymentDialog: (Int) -> Unit,
    private val onPlay: (CommonInfoReel) -> Unit,
) : RecyclerView.Adapter<ReelsAdapter.ReelViewHolder>() {

    var currentPlayingPosition = -1
    val players = mutableListOf<ExoPlayer?>()
    private val handler = Handler(Looper.getMainLooper())
    private val updateSeekBarRunnable = object : Runnable {
        override fun run() {
            if (currentPlayingPosition != -1 && currentPlayingPosition < players.size) {
                players[currentPlayingPosition]?.let { player ->
                    val viewHolder = recyclerView?.findViewHolderForAdapterPosition(currentPlayingPosition) as? ReelViewHolder
                    viewHolder?.updateSeekBar(player)
                }
            }
            handler.postDelayed(this, 500)
        }
    }

    init {
        repeat(reels.size) { players.add(null) }
        instance = this
    }

    companion object {
        var instance: ReelsAdapter? = null
    }

    override fun getItemCount(): Int = reels.size

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReelViewHolder {
        val binding = ItemReelBinding.inflate(LayoutInflater.from(reelsActivity), parent, false)
        return ReelViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReelViewHolder, position: Int) {
        holder.bind(reels[position], isMuted, position == currentPlayingPosition, position)
    }

    override fun onViewRecycled(holder: ReelViewHolder) {
        super.onViewRecycled(holder)
        holder.releasePlayer()
    }

    fun updatePlayback(currentPosition: Int) {
        if (currentPlayingPosition != currentPosition && currentPosition != -1) {
            reels = reels.map {
                it.isPlaying = (it == reels[currentPosition])
                it
            }
            if (currentPlayingPosition != -1 && currentPlayingPosition < players.size) {
                players[currentPlayingPosition]?.let { player ->
                    player.playWhenReady = false
                }
            }

            currentPlayingPosition = currentPosition
            if (currentPlayingPosition < players.size) {
                players[currentPlayingPosition]?.let { player ->
                    player.playWhenReady = true
                }
            }
        }

        if (currentPlayingPosition != -1) {
            handler.post(updateSeekBarRunnable)
        } else {
            handler.removeCallbacks(updateSeekBarRunnable)
        }
    }

    fun pauseAllPlayers() {
        players.forEachIndexed { index, player ->
            player?.let {
                it.playWhenReady = false
            }
        }
        try {
            val viewHolder = recyclerView?.findViewHolderForAdapterPosition(currentPlayingPosition) as? ReelViewHolder
            viewHolder?.binding?.playPauseIcon?.setImageResource(R.drawable.ic_play)
        } catch (e: Exception) {
        }

        currentPlayingPosition = -1
        handler.removeCallbacks(updateSeekBarRunnable)

    }

    fun resumeCurrentPlayer() {
        val visiblePosition = (currentPlayingPosition
            .takeIf { it != -1 && it < players.size }
            ?: (recyclerView?.layoutManager as? LinearLayoutManager)?.findFirstCompletelyVisibleItemPosition()
            ?: -1)
        if (visiblePosition != -1 && visiblePosition < players.size) {
            if (reels[visiblePosition].isLocked == false) {
                players[visiblePosition]?.let { player ->
                    player.playWhenReady = true
                    currentPlayingPosition = visiblePosition
                    handler.post(updateSeekBarRunnable)
                    val viewHolder = recyclerView?.findViewHolderForAdapterPosition(currentPlayingPosition) as? ReelViewHolder
                    viewHolder?.showFlContainer(viewHolder.binding)

                    if (player.isPlaying) {
                        viewHolder?.binding?.playPauseIcon?.setImageResource(R.drawable.ic_pause)
                    } else {
                        viewHolder?.binding?.playPauseIcon?.setImageResource(R.drawable.ic_play)
                    }
                    viewHolder?.binding?.playPauseIcon?.postDelayed({
                        viewHolder.hideFlContainer(viewHolder.binding)
                    }, 5000)
                }
            }
        }
    }

    fun releaseAllPlayers() {
        players.forEachIndexed { index, player ->
            player?.release()
        }
        players.clear()
        currentPlayingPosition = -1
        handler.removeCallbacks(updateSeekBarRunnable)
    }

    private var recyclerView: RecyclerView? = null

    override fun onAttachedToRecyclerView(recyclerView: RecyclerView) {
        super.onAttachedToRecyclerView(recyclerView)
        this.recyclerView = recyclerView
    }

    override fun onDetachedFromRecyclerView(recyclerView: RecyclerView) {
        super.onDetachedFromRecyclerView(recyclerView)
        releaseAllPlayers()
        this.recyclerView = null
    }


    @OptIn(UnstableApi::class)
    inner class ReelViewHolder(val binding: ItemReelBinding) : RecyclerView.ViewHolder(binding.root) {
        private var exoPlayer: ExoPlayer? = null


        init {
            binding.seekbar.setOnSeekBarChangeListener(object :
                android.widget.SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(
                    seekBar: android.widget.SeekBar?,
                    progress: Int,
                    fromUser: Boolean,
                ) {
                    if (fromUser) {
                        exoPlayer?.let { player ->
                            val duration = player.duration
                            if (duration > 0) {
                                val newPosition = (progress * duration / 100).toLong()
                                player.seekTo(newPosition)
                            }
                        }
                    }
                }

                override fun onStartTrackingTouch(seekBar: android.widget.SeekBar?) {
                    exoPlayer?.playWhenReady = false
                }

                override fun onStopTrackingTouch(seekBar: android.widget.SeekBar?) {
                    exoPlayer?.playWhenReady = true
                }
            })
        }

        @OptIn(UnstableApi::class)
        fun bind(reelInfo: CommonInfoReel, isMuted: Boolean, shouldPlay: Boolean, position: Int) {

            releasePlayer()

            if (reelInfo.isLocked) {
                binding.flContainer2.visibility = View.VISIBLE
                binding.flContainer2.setOnClickListener {
                    onShowPaymentDialog(position)
                }
                binding.btnBack.visibility = View.GONE
                binding.btnBack2.setOnClickListener {
                    reelsActivity.onBackPressed()
                }
            } else {
                binding.btnBack.visibility = View.VISIBLE
                binding.flContainer2.visibility = View.GONE
            }
            // Disable SeekBar if the reel is locked
            binding.seekbar.isEnabled = !reelInfo.isLocked
            // Optional: Adjust visual appearance for locked state
            binding.seekbar.alpha = if (reelInfo.isLocked) 0.5f else 1.0f

            exoPlayer = ExoPlayer.Builder(reelsActivity)
                .build().apply {
                if (reelInfo.videoUrl == null) {
                    reelInfo.videoUrl = reelInfo.coverVideo
                }
                reelInfo.videoUrl?.let { videoUrl ->

                    videoScalingMode = VIDEO_SCALING_MODE_SCALE_TO_FIT
                    setHandleAudioBecomingNoisy(true)
                    val episodeNumber = if (reelInfo.isTrailer) {
                        "0"
                    } else {
                        (reelInfo.episodeNumber).toString()
                    }

                    val request = HLSVideoUrlRequest("web", episodeNumber, (reelInfo.seriesId).toString())
                    val finalUrl = runBlocking {
                        reelsActivity.viewModel.getStreamingUrl(reelsActivity, request)
                    }

                    Log.e("Reels", "Video URL finalUrl : $finalUrl")

//                    val mediaSource = if (finalUrl.isNullOrEmpty() || reelInfo.isTrailer) {
//                        CommonsKt.buildProgressiveMediaSource(videoUrl)
//                    } else {
//                        CommonsKt.buildHlsMediaSource(finalUrl)
//                    }

                    val mediaSource = if (finalUrl.first.isNullOrEmpty() || finalUrl.second == UserViewModel.VideoType.EXTERNAL) {
                        CommonsKt.buildProgressiveMediaSource(videoUrl)
                    } else {
                        CommonsKt.buildHlsMediaSource(finalUrl.first!!)
                    }
                    setMediaSource(mediaSource)
                    prepare()
                    volume = if (isMuted) 0f else 1f
                    playWhenReady = shouldPlay

                    addListener(object : Player.Listener {
                        override fun onPlaybackStateChanged(state: Int) {
                            when (state) {
                                Player.STATE_READY -> {
                                    if (adapterPosition == currentPlayingPosition) {
                                        updateSeekBar(this@apply)
                                        if (isPlaying) {
                                            onPlay(reelInfo)
                                            binding.playPauseIcon.setImageResource(R.drawable.ic_pause)
                                            hideFlContainer(binding)
                                        } else {
                                            binding.playPauseIcon.setImageResource(R.drawable.ic_play)
                                        }
                                    }
                                }

                                Player.STATE_ENDED -> {
                                    if (adapterPosition == currentPlayingPosition) {
                                        // Reset video position to zero
                                        seekTo(0)
                                        playWhenReady = false
                                        // Update UI
                                        binding.seekbar.progress = 0
                                        binding.playPauseIcon.setImageResource(R.drawable.ic_play)
                                        handler.removeCallbacks(updateSeekBarRunnable)
                                        showFlContainer(binding)
                                        val nextPosition = adapterPosition + 1
                                        if (nextPosition < reels.size) {
                                            currentPlayingPosition = nextPosition
                                            if (reels[nextPosition].isLocked) {
                                                reelsActivity.onNext(
                                                    currentPlayingPosition,
                                                    reelsActivity.episodesListBottomSheet?.reelsAdapter!!
                                                )
                                            } else {
                                                players[nextPosition]?.let { player ->
                                                    player.playWhenReady = true
                                                }
                                                reelsActivity.onNext(
                                                    currentPlayingPosition,
                                                    reelsActivity.episodesListBottomSheet?.reelsAdapter!!
                                                )
                                            }
                                        } else {
                                            currentPlayingPosition = -1
                                            reelsActivity.showToast("No more items to play")
                                            reelsActivity.finish()
                                        }
                                    }
                                }
                            }
                        }

                        override fun onPlayWhenReadyChanged(playWhenReady: Boolean, reason: Int) {
                            if (playWhenReady && adapterPosition == currentPlayingPosition) {
                                if (isPlaying) {
                                    binding.playPauseIcon.setImageResource(R.drawable.ic_pause)
                                    hideFlContainer(binding)
                                } else {
                                    binding.playPauseIcon.setImageResource(R.drawable.ic_play)
                                }
                            }
                        }
                    })
                }
            }
            binding.playerView.player = exoPlayer
            binding.playerView.setShowBuffering(PlayerView.SHOW_BUFFERING_ALWAYS)
            binding.playerView.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_ZOOM
            binding.playerView.useController = false
            players[position] = exoPlayer

            reelInfo.thumbnailUrl?.let {
                Glide.with(reelsActivity)
                    .load(reelInfo.thumbnailUrl)
                    .placeholder(R.drawable.background_image)
                    .into(binding.thumbnail)
            }
            reelInfo.thumbnail?.let {
                Glide.with(reelsActivity)
                    .load(reelInfo.thumbnail)
                    .placeholder(R.drawable.background_image)
                    .into(binding.thumbnail)
            }
            if (reelInfo.isTrailer) {
                reelInfo.poster?.let {
                    Glide.with(reelsActivity)
                        .load(reelInfo.poster)
                        .placeholder(R.drawable.background_image)
                        .into(binding.thumbnail)
                }
            }

            binding.title.text = reelInfo.title
            binding.description.text = reelInfo.description
            binding.description.setOnClickListener {
                infoLauncher.launch(
                    Intent(
                        binding.description.context,
                        SeriesInfoActivity::class.java
                    ).apply {
                        if (isSeries) {
                            putExtra(CommonsKt.SERIES_ID_EXTRA, reelInfo.id.toString())
                        } else {
                            putExtra(CommonsKt.SERIES_ID_EXTRA, reelInfo.seriesId.toString())
                            putExtra(CommonsKt.POSITION_EXTRA, position)
                        }
                    }
                )
            }

            binding.favourite.setImageResource(
                if (reelInfo.isFavourites == 1) {
                    R.drawable.ic_favourite_fill
                } else {
                    R.drawable.ic_favourite
                }
            )

            binding.category.text = reelInfo.categoryName
            binding.textLike.text = reelInfo.likedCount.formatNumber()
            binding.textFavourite.text = reelInfo.favouritesCount.formatNumber()

            binding.imgLike.setImageResource(
                if (reelInfo.isLiked == 1) {
                    R.drawable.ic_like_fill
                } else {
                    R.drawable.ic_like
                }
            )
            binding.volumeIcon.setImageResource(
                if (isMuted) R.drawable.ic_volume_off else R.drawable.ic_volume_on
            )
            binding.btnBack.setOnClickListener {
                reelsActivity.onBackPressed()
            }

            binding.volumeIcon.setOnClickListener {
                exoPlayer?.let { player ->
                    if (player.isPlaying) {
                        this@ReelsAdapter.isMuted = !this@ReelsAdapter.isMuted
                        player.volume = if (this@ReelsAdapter.isMuted) 0f else 1f
                        binding.volumeIcon.setImageResource(if (this@ReelsAdapter.isMuted) R.drawable.ic_volume_off else R.drawable.ic_volume_on)
                        onMuteChangeListener(this@ReelsAdapter.isMuted)
                    }
                }
            }

            binding.seekbar.max = 100
            updateSeekBar(exoPlayer)

            binding.playPauseIcon.setOnClickListener {
                exoPlayer?.let { player ->
                    if (reelInfo.isLocked == false) {
                        if (player.isPlaying) {
                            player.playWhenReady = false
                            reelInfo.isPlaying = false
                            binding.playPauseIcon.setImageResource(R.drawable.ic_play)
                        } else {
                            player.playWhenReady = true
                            reelInfo.isPlaying = true
                            binding.playPauseIcon.setImageResource(R.drawable.ic_pause)
                        }

                        showFlContainer(binding)

                        if (player.isPlaying) {
                            currentPlayingPosition = adapterPosition
                            handler.post(updateSeekBarRunnable)
                            binding.playPauseIcon.postDelayed({
                                hideFlContainer(binding)
                            }, 5000)
                        } else if (currentPlayingPosition == adapterPosition) {
                            currentPlayingPosition = -1
                            handler.removeCallbacks(updateSeekBarRunnable)
                        }
                    } else {
                        binding.playPauseIcon.setImageResource(R.drawable.ic_play)
//                        if (!reelsActivity.isShowFullScreenAdDialog) {
//                            onShowPaymentDialog(position)
//                        }
                    }
                }
            }

            binding.playerView.setOnClickListener {
                if (binding.flContainer.visibility != View.VISIBLE) {
                    showFlContainer(binding)
                    binding.playPauseIcon.postDelayed({
                        hideFlContainer(binding)
                    }, 5000)
                }
            }

            binding.imgLike.setOnClickListener {
                reelInfo.isLiked = if (reelInfo.isLiked == 0) 1 else 0

                binding.textLike.text = if (reelInfo.isLiked == 1) {
                    (binding.textLike.text.toString().toInt() + 1).toString()
                } else {
                    if(reelInfo.likedCount.isNotNegative()){
                        (binding.textLike.text.toString().toInt() - 1).toString()
                    } else {
                        binding.textLike.text.toString()
                    }
                }

                binding.imgLike.setImageResource(
                    if (reelInfo.isLiked == 1) {
                        R.drawable.ic_like_fill
                    } else {
                        R.drawable.ic_like
                    }
                )

                onLikeChangeListener(adapterPosition, reelInfo)
            }

            binding.favourite.setOnClickListener {
                reelInfo.isFavourites = if (reelInfo.isFavourites == 0) 1 else 0
                binding.textFavourite.text = if (reelInfo.isFavourites == 1) {
                    (binding.textFavourite.text.toString().toInt() + 1).toString()
                } else {
                    (binding.textFavourite.text.toString().toInt() - 1).toString()
                }

                binding.favourite.setImageResource(
                    if (reelInfo.isFavourites == 1) {
                        R.drawable.ic_favourite_fill
                    } else {
                        R.drawable.ic_favourite
                    }
                )

                onSetFavouriteListener(adapterPosition, reelInfo)
            }

            binding.imgShare.setOnClickListener {

                val playUrl = "https://play.google.com/store/apps/details?id=" + binding.imgShare.context.packageName
                reels[0].poster?.let {
                    CommonsKt.shareContent(
                        binding.imgShare.context,
                        reelInfo.poster!!,
                        reelInfo.title!!,
                        "🎬 Don’t wait, watch on ${binding.imgShare.context.getString(R.string.app_name)}",
                        playUrl
                    )
                }

            }

            if (isSeries) {
                binding.llEpisode.visibility = View.GONE
                binding.btnWatchNow.setOnClickListener {
                    onClickMoreEpisodeListener(adapterPosition)
                }
            } else {
                binding.btnWatchNow.visibility = View.GONE
                binding.llEpisode.setOnClickListener {
                    onClickMoreEpisodeListener(adapterPosition)
                }

                if (reelInfo.isTrailer) {
                    binding.playTotal.visibility = View.GONE
                    binding.playCur.text = "TRAILER"
                } else {
                    binding.playTotal.visibility = View.VISIBLE
                    binding.playTotal.text = "/EP.${reels[reels.size - 1].episodeNumber}"
                    binding.playCur.text = "EP.${(reelInfo.episodeNumber)}"
                }
            }

            reelInfo.isPlaying = shouldPlay
        }

        fun hideFlContainer(binding: ItemReelBinding) {
            binding.flContainer.visibility = View.GONE
        }

        fun showFlContainer(binding: ItemReelBinding) {
            binding.flContainer.visibility = View.VISIBLE
        }

        fun updateSeekBar(player: ExoPlayer?) {
            player?.let {
                Log.e("TAG", "updateSeekBar duration: ${it.duration}, position :  ${it.currentPosition}")
                val duration = it.duration
                val position = it.currentPosition
                if (duration > 0) {
                    val progress = (position * 100 / duration).toInt()
                    val buffered = ((player.bufferedPosition * 1000) / duration).toInt()

                    binding.seekbar.progress = progress
                    binding.seekbar.secondaryProgress = buffered
                } else {
                    binding.seekbar.progress = 0
                }
            }
        }

        fun releasePlayer() {
            try {
                exoPlayer?.let { player ->
                    player.stop()
                    player.release()
                    if (players[adapterPosition] != null) {
                        players[adapterPosition] = null
                    }
                }
                exoPlayer = null
                binding.playerView.player = null
                binding.seekbar.progress = 0
            } catch (e: Exception) {
                // e.printStackTrace()
            }
        }
    }
}
