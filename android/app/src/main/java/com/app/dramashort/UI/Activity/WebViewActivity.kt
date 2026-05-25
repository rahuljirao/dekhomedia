package com.app.dramashort.UI.Activity

import android.os.Bundle
import androidx.activity.viewModels
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityTermConditionBinding
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.getValue


@AndroidEntryPoint
class WebViewActivity : BaseActivity() {
    val viewModel: UserViewModel by viewModels()


    lateinit var binding: ActivityTermConditionBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTermConditionBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.apply {

            btnBack.setOnClickListener {
                onBackPressed()
            }


            val url = intent.getStringExtra(CommonsKt.URL_EXTRA)
            val name = intent.getStringExtra(CommonsKt.TITLE_EXTRA)

            name?.let {
                title.text = name
            }
            url?.let {
                webView.loadUrl(url)
            }
        }

    }
}