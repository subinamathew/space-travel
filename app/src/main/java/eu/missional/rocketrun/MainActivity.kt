package eu.missional.rocketrun

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.*
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import eu.missional.rocketrun.ui.theme.RocketRunTheme
import eu.missional.rocketrun.ui.theme.SpaceBlack

class MainActivity : ComponentActivity() {

    private var webView: WebView? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            RocketRunTheme {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(SpaceBlack)
                        .windowInsetsPadding(WindowInsets.statusBars)
                ) {
                    var canGoBack by remember { mutableStateOf(false) }

                    BackHandler(enabled = canGoBack) {
                        webView?.let {
                            if (it.canGoBack()) {
                                it.goBack()
                            }
                        }
                    }

                    AndroidView(
                        factory = { context ->
                            WebView(context).apply {
                                layoutParams = ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                                )
                                setBackgroundColor(0xFF030712.toInt())

                                settings.apply {
                                    javaScriptEnabled = true
                                    domStorageEnabled = true
                                    databaseEnabled = true
                                    allowFileAccess = true
                                    allowContentAccess = true
                                    allowFileAccessFromFileURLs = true
                                    allowUniversalAccessFromFileURLs = true
                                    mediaPlaybackRequiresUserGesture = false
                                    cacheMode = WebSettings.LOAD_DEFAULT
                                    useWideViewPort = true
                                    loadWithOverviewMode = true
                                    displayZoomControls = false
                                    builtInZoomControls = false
                                }

                                webViewClient = object : WebViewClient() {
                                    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                        super.onPageStarted(view, url, favicon)
                                        canGoBack = view?.canGoBack() == true
                                    }

                                    override fun onPageFinished(view: WebView?, url: String?) {
                                        super.onPageFinished(view, url)
                                        canGoBack = view?.canGoBack() == true
                                    }

                                    override fun shouldOverrideUrlLoading(
                                        view: WebView?,
                                        request: WebResourceRequest?
                                    ): Boolean {
                                        val url = request?.url?.toString() ?: return false
                                        return if (url.startsWith("file:///android_asset/")) {
                                            false
                                        } else {
                                            try {
                                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                                context.startActivity(intent)
                                            } catch (_: Exception) {}
                                            true
                                        }
                                    }
                                }

                                webChromeClient = WebChromeClient()

                                loadUrl("file:///android_asset/web/index.html")
                                webView = this
                            }
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }

    override fun onDestroy() {
        webView?.destroy()
        webView = null
        super.onDestroy()
    }
}
