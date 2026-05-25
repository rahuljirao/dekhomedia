package com.app.dramashort.UI.Activity

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.recyclerview.widget.GridLayoutManager
import com.app.dramashort.UI.Adapter.FeedbackAdapter
import com.app.dramashort.databinding.ActivityFeedBackBinding
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseActivity
import java.io.IOException

@AndroidEntryPoint
class FeedBackActivity : BaseActivity() {

    val subCategoryNames = listOf(
        "Delete photos",
        "Manage albums",
        "Vault",
        "Sync photos",
        "Billing",
        "Stories",
        "Duplicate finder",
        "Places"
    )

    private lateinit var binding: ActivityFeedBackBinding
    private lateinit var feedbackAdapter: FeedbackAdapter
    private val feedbackCategories = ArrayList<String>()

    private val imagePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val data = result.data
            feedbackCategories.clear()

            if (data?.clipData != null) {
                val count = data.clipData!!.itemCount
                for (i in 0 until count) {
                    val uri = data.clipData!!.getItemAt(i).uri
                    feedbackCategories.add(uri.toString())
                }
            } else if (data?.data != null) {
                val uri = data.data!!
                feedbackCategories.add(uri.toString())
            }

            updateImagePreview(feedbackCategories)
        }
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFeedBackBinding.inflate(layoutInflater)
        setContentView(binding.root)








        initializeViews()
        setupAdapters()
        setupClickListeners()
        loadFeedbackData()
    }

    private fun initializeViews() {
        binding.btnBack.setOnClickListener { onBackPressed() }
    }

    private fun setupAdapters() {
        feedbackAdapter = FeedbackAdapter(feedbackCategories) { _ -> null }
        binding.feedbackRecycler.layoutManager = GridLayoutManager(this, 4)
        binding.feedbackRecycler.adapter = feedbackAdapter
    }

    private fun setupClickListeners() {
        binding.uploadImage.setOnClickListener { checkAndRequestPermissions() }
        binding.btnSubmit.setOnClickListener { submitFeedback() }
    }

    private fun loadFeedbackData() {
        if (isNetworkAvailable(this)) {
            binding.progressBar.visibility = View.GONE
        } else {
            loadLocalFeedback()
        }
    }

    private fun checkAndRequestPermissions() {
        try {
            pickImages()
        } catch (e: Exception) {

            showToast("storage_permission")
        }


    }

    private fun pickImages() {
        val intent = Intent(Intent.ACTION_PICK).apply {
            type = "image/*"
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        }
        try {
            imagePickerLauncher.launch(Intent.createChooser(intent, "Select Pictures"))
        } catch (e: Exception) {

            showToast("no_gallery_app_found")
        }
    }

    private fun updateImagePreview(paths: ArrayList<String>) {
        binding.imagePreview.visibility = View.VISIBLE
        feedbackAdapter.setData(paths)
        feedbackAdapter.notifyDataSetChanged()
    }

    private fun loadLocalFeedback() {
        try {


        } catch (e: IOException) {
//            e.printStackTrace()
//            showToast("Failed to load local feedback data")
        }
    }

    private fun submitFeedback() {
        val feedbackText = binding.userFeedback.text.toString().trim()

        if (feedbackText.isEmpty()) {
            showToast("Please enter your feedback.")
            return
        }

        val emailIntent = Intent(Intent.ACTION_SEND_MULTIPLE).apply {
            type = "message/rfc822"
            putExtra(Intent.EXTRA_EMAIL, arrayOf("support@example.com"))
            putExtra(Intent.EXTRA_SUBJECT, "App Feedback")
            putExtra(Intent.EXTRA_TEXT, feedbackText)

            // Attach selected image URIs
            val uris = feedbackCategories.map { Uri.parse(it) }
            putParcelableArrayListExtra(Intent.EXTRA_STREAM, ArrayList(uris))
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }

        try {
            startActivity(Intent.createChooser(emailIntent, "Send feedback via email..."))
        } catch (e: Exception) {

            showToast("No email app found.")
        }
    }


    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }


    companion object {
        fun isNetworkAvailable(context: Context): Boolean {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                ?: return false

            val capabilities = cm.getNetworkCapabilities(cm.activeNetwork)
            return capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true ||
                    capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true ||
                    capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true
        }
    }


}

