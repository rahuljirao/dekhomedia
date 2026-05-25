package com.app.dramashort.Utils

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import android.util.Log
import java.security.KeyStore
import javax.crypto.AEADBadTagException
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class SecurePrefsHelper(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("secure_prefs", Context.MODE_PRIVATE)
    private val keyAlias = "MySecureKeyAlias"

    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)

        return if (keyStore.containsAlias(keyAlias)) {
            (keyStore.getEntry(keyAlias, null) as KeyStore.SecretKeyEntry).secretKey
        } else {
            val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
            val parameterSpec = KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            ).setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build()

            keyGenerator.init(parameterSpec)
            keyGenerator.generateKey()
        }
    }

    fun saveEncrypted(key: String, value: String) {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
        val iv = cipher.iv
        val encryptedBytes = cipher.doFinal(value.toByteArray(Charsets.UTF_8))

        val encryptedBase64 = Base64.encodeToString(encryptedBytes, Base64.DEFAULT)
        val ivBase64 = Base64.encodeToString(iv, Base64.DEFAULT)

        prefs.edit()
            .putString("${key}_data", encryptedBase64)
            .putString("${key}_iv", ivBase64)
            .apply()
    }

//    fun getDecrypted(key: String): String? {
//        val encryptedBase64 = prefs.getString("${key}_data", null) ?: return null
//        val ivBase64 = prefs.getString("${key}_iv", null) ?: return null
//
//        val encryptedBytes = Base64.decode(encryptedBase64, Base64.DEFAULT)
//        val iv = Base64.decode(ivBase64, Base64.DEFAULT)
//
//        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
//        val spec = GCMParameterSpec(128, iv)
//        cipher.init(Cipher.DECRYPT_MODE, getOrCreateSecretKey(), spec)
//
//        val decryptedBytes = cipher.doFinal(encryptedBytes)
//        return String(decryptedBytes, Charsets.UTF_8)
//    }

    fun getDecrypted(key: String): String? {
        val encryptedBase64 = prefs.getString("${key}_data", null) ?: return null
        val ivBase64 = prefs.getString("${key}_iv", null) ?: return null

        return try {
            val encryptedBytes = Base64.decode(encryptedBase64, Base64.DEFAULT)
            val iv = Base64.decode(ivBase64, Base64.DEFAULT)

            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val spec = GCMParameterSpec(128, iv)
            cipher.init(Cipher.DECRYPT_MODE, getOrCreateSecretKey(), spec)

            val decryptedBytes = cipher.doFinal(encryptedBytes)
            String(decryptedBytes, Charsets.UTF_8)
        } catch (e: AEADBadTagException) {
            Log.e("TAG", "getDecrypted AEADBadTagException: $e")
            // Decryption failed: possibly due to invalid key or corrupted data
            delete(key) // Remove invalid entry
            null
        } catch (e: Exception) {
            Log.e("TAG", "getDecrypted Exception: $e")
            // Other decryption error
            null
        }
    }



    fun delete(key: String) {
        prefs.edit()
            .remove("${key}_data")
            .remove("${key}_iv")
            .apply()
    }
}
