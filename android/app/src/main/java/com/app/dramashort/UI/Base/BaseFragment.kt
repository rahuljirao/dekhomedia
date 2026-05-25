package test.app.gallery.UI1.Base

import androidx.fragment.app.Fragment
import com.app.dramashort.UI.Adapter.SeriesReelsAdapter
import com.app.dramashort.Utils.AdminPreference

abstract class BaseFragment : Fragment() {
    lateinit var pref: AdminPreference
    var reelsAdapter2: SeriesReelsAdapter? = null

    override fun onAttach(context: android.content.Context) {
        super.onAttach(context)
        pref = AdminPreference(context)
    }
}