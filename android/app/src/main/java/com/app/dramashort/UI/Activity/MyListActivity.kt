package com.app.dramashort.UI.Activity

import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import com.app.dramashort.R
import com.app.dramashort.UI.Fragment.MyListFragment
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityMyListBinding
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class MyListActivity : BaseActivity() {
    lateinit var binding: ActivityMyListBinding
    val viewModel: UserViewModel by viewModels()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMyListBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }

    override fun onResume() {
        super.onResume()
        val myListFragment = supportFragmentManager.findFragmentById(R.id.fragment_container_view) as? MyListFragment
        myListFragment?.binding?.btnBack?.visibility = View.VISIBLE // Call your function
        myListFragment?.binding?.btnBack?.setOnClickListener {
            onBackPressed()
        }
    }
}