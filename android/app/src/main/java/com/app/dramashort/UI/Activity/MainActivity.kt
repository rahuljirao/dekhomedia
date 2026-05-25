package com.app.dramashort.UI.Activity

import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.viewModelScope
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.app.dramashort.APIs.ApiService
import com.app.dramashort.Ads.AdManager
import com.app.dramashort.Fcm.MyFirebaseMessagingService
import com.app.dramashort.R
import com.app.dramashort.UI.Fragment.HistoryFragment
import com.app.dramashort.UI.Fragment.HomeFragment
import com.app.dramashort.UI.Fragment.ListFragment
import com.app.dramashort.UI.Fragment.MyListFragment
import com.app.dramashort.UI.Fragment.ProfileFragment
import com.app.dramashort.UI.Fragment.ReelsFragment
import com.app.dramashort.UI.Fragment.RewardsFragment
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityMain2Binding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import javax.inject.Inject
import kotlin.getValue

@AndroidEntryPoint
class MainActivity : BaseActivity() {


    val viewModel: UserViewModel by viewModels()
    lateinit var binding: ActivityMain2Binding
    lateinit var recommendedBottomSheet: com.app.dramashort.Dialogs.RecommendBottomSheetDialogFragment
    var fragmentsList = ArrayList<Fragment>()
    var reelsFragment = ReelsFragment()

    @Inject
    lateinit var apiService: ApiService


    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            viewModel.viewModelScope.launch {
                val result = viewModel.repository.setUpdateReward("turn_on_notification")
                if (result is ApiResult.Success) {
                    result.data.responseDetails?.let {
                        Toast.makeText(this@MainActivity, "Notification permission granted", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        } else {
//            Toast.makeText(this@MainActivity, "Notification permission denied", Toast.LENGTH_SHORT).show()
        }
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMain2Binding.inflate(layoutInflater)
        setContentView(binding.root)

        AdManager(apiService, this)

        MyFirebaseMessagingService.createNotificationChannel(this)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
            ) {
                requestPermissionLauncher.launch(android.Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        binding.homePager.offscreenPageLimit = 1

        // Optional: Add page transition animation
        binding.homePager.setPageTransformer { page, position ->
            val absPos = Math.abs(position)
            page.alpha = 1 - absPos // Fade effect
            page.scaleY = 1 - absPos * 0.1f // Scale effect
        }

        // With this (safer approach):
        val recyclerView = binding.homePager.getChildAt(0) as? RecyclerView
        recyclerView?.let {
            if (it.onFlingListener == null) { // Check if no listener exists
                PagerSnapHelper().attachToRecyclerView(it)
            }
        }

        fragmentsList.add(HomeFragment())
        fragmentsList.add(reelsFragment)
        fragmentsList.add(MyListFragment())
        fragmentsList.add(RewardsFragment())
        fragmentsList.add(ProfileFragment())

        class MainPagerAdapter(activity: FragmentActivity) : FragmentStateAdapter(activity) {
            override fun getItemCount() = fragmentsList.size
            override fun createFragment(position: Int) = fragmentsList[position]
        }

        binding.apply {
            homePager.setAdapter(MainPagerAdapter(this@MainActivity))
            homePager.setUserInputEnabled(false)
            homePager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
                override fun onPageSelected(position: Int) {
                    super.onPageSelected(position)
                    bottomNavigationView.menu.getItem(position).isChecked = true
                }
            })

            bottomNavigationView.setOnNavigationItemSelectedListener { item ->
                if (item.itemId == R.id.home) {
                    homePager.currentItem = 0
                    if (reelsFragment.getReelsAdpIsInitialized()) {
                        reelsFragment.seriesReelsAdapter.pauseAllPlayers()
                    }
                    return@setOnNavigationItemSelectedListener true
                } else if (item.itemId == R.id.for_you) {
                    homePager.currentItem = 1
                    return@setOnNavigationItemSelectedListener true
                } else if (item.itemId === R.id.my_lis) {
                    homePager.currentItem = 2
                    if (reelsFragment.getReelsAdpIsInitialized()) {
                        reelsFragment.seriesReelsAdapter.pauseAllPlayers()

                    }
                    return@setOnNavigationItemSelectedListener true
                } else if (item.itemId == R.id.rewards) {
                    homePager.currentItem = 3
                    if (reelsFragment.getReelsAdpIsInitialized()) {
                        reelsFragment.seriesReelsAdapter.pauseAllPlayers()
                    }
                    return@setOnNavigationItemSelectedListener true
                } else if (item.itemId == R.id.profile) {
                    homePager.currentItem = 4
                    if (reelsFragment.getReelsAdpIsInitialized()) {
                        reelsFragment.seriesReelsAdapter.pauseAllPlayers()
                    }
                    return@setOnNavigationItemSelectedListener true
                } else {
                    return@setOnNavigationItemSelectedListener false
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
    }

    private var doubleBackToExitPressedOnce = false

    @SuppressLint("MissingSuperCall")
    override fun onBackPressed() {
        if (HistoryFragment.instance != null && HistoryFragment.instance!!.isVisible) {
            if (HistoryFragment.instance!!.adapter.isSelectionMode) {
                HistoryFragment.instance!!.adapter.clearSelection()
                HistoryFragment.instance!!.adapter.updateItem()
            } else {
                onBackPressed2()
            }
        } else if (ListFragment.instance != null && ListFragment.instance!!.isVisible) {
            if (ListFragment.instance!!.adapter.isSelectionMode) {
                ListFragment.instance!!.adapter.clearSelection()
                ListFragment.instance!!.adapter.updateItem()
            } else {
                onBackPressed2()
            }
        } else {
            onBackPressed2()
        }
    }


    fun onBackPressed2() {
        if(binding.homePager.currentItem != 0){
            binding.homePager.currentItem = 0
            return
        }
        if (doubleBackToExitPressedOnce) {
            super.onBackPressed()
            return
        }
        showToast("Press back again to exit")
        doubleBackToExitPressedOnce = true
        Handler(Looper.getMainLooper()).postDelayed({ doubleBackToExitPressedOnce = false }, 3000)
    }
}