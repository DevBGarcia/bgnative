package com.bgnative

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundService"
    }

    @ReactMethod
    fun startService() {
        val serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java)
        reactApplicationContext.startService(serviceIntent)
    }

    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}