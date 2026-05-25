package com.app.dramashort.Dialogs

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.R
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.UI.Adapter.EpisodeListAdapter
import com.app.dramashort.Utils.CommonsKt.EPISODE_SPLIT_SIZE
import com.app.dramashort.Utils.toBoolean
import com.app.dramashort.databinding.BSheetEpisodeBinding
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.tabs.TabLayout

class EpisodesListBottomSheet(
    val activity: ReelsActivity,
    var reels: List<CommonInfoReel>,
    val setOnClickListener: (Int, EpisodeListAdapter) -> Unit,
    val setOnCheckedChangeListener: (Int, Boolean) -> Unit,
) : BottomSheetDialogFragment() {

    lateinit var reelsAdapter: EpisodeListAdapter
    lateinit var binding: BSheetEpisodeBinding

    init {
        reelsAdapter = EpisodeListAdapter(emptyList()) {}
    }


    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return BottomSheetDialog(activity, R.style.MyTransparentBottomSheetDialogTheme)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
//        view.setBackgroundColor(Color.TRANSPARENT)
        setupViews(reels)
    }

    fun setupViews(reels1: List<CommonInfoReel>) {
        val isLockedList = reels1.filter { it.isLocked }

        if (ReelShortApp.instance.loginResponse?.isWeeklyVip?.toBoolean == true ||
            ReelShortApp.instance.loginResponse?.isYearlyVip?.toBoolean == true ||
            isLockedList.isEmpty()
        ) {
            binding.unlockSwitch.visibility = View.GONE
        } else {
            binding.unlockSwitch.visibility = View.VISIBLE
        }

        binding.unlockSwitch.isChecked = reels1[activity.index].isAutoUnlocked == 1
        binding.unlockSwitch.setOnCheckedChangeListener { buttonView, isChecked ->
            setOnCheckedChangeListener(reels1.first().seriesId!!, isChecked)
        }


        if (reels1.size > EPISODE_SPLIT_SIZE) {
            val chunks: List<List<CommonInfoReel>> = reels1.chunked(EPISODE_SPLIT_SIZE)
            reelsAdapter = EpisodeListAdapter(ArrayList()) { position ->
                val pos = reels1.indexOfFirst { it == reelsAdapter!!.items[position] }
                setOnClickListener(pos, reelsAdapter!!)
                this.dismiss()
            }
            binding.recyclerView.adapter = reelsAdapter

//            val isTrailer = if (reels.first().isTrailer) 1 else 0
//            var counter = isTrailer
            var selected = 0


            chunks.forEachIndexed { tabIndex, mylist ->
                mylist.forEachIndexed { mModelIndex, mModel ->
                    if (mModel.isPlaying) {
                        selected = tabIndex
                    }
                }

            }

            chunks.forEach { list ->
                if (list.isNotEmpty()) {
                    val first = if (list.first().isTrailer) 0 else list.first().episodeNumber
                    binding.tabLayout.addTab(
                        binding.tabLayout.newTab().setText("${first}-${list.last().episodeNumber}")
                    )
                }
            }

            binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab?) {
                    val position = tab?.position ?: 0
                    reelsAdapter!!.submitList(chunks[position], reels1)
                }

                override fun onTabUnselected(tab: TabLayout.Tab?) {}
                override fun onTabReselected(tab: TabLayout.Tab?) {}
            })
            reelsAdapter!!.submitList(chunks[selected], reels1)
            binding.tabLayout.getTabAt(selected)?.select()
        } else {
            reelsAdapter = EpisodeListAdapter(reels1) { position ->
                setOnClickListener(position, reelsAdapter!!)
                this.dismiss()
            }
            binding.recyclerView.adapter = reelsAdapter
            binding.tabLayout.visibility = View.GONE
        }

        binding.btnBack.setOnClickListener {
            this.dismiss()
        }
//        binding.title.text = reels.
    }


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = BSheetEpisodeBinding.inflate(inflater, container, false)
        return binding.root
    }

    companion object {
        const val TAG = "EpisodesListBottomSheet"
    }
}