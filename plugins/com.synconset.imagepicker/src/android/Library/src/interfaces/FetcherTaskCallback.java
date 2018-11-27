package com.synconset.interfaces;

import android.graphics.Bitmap;

public interface FetcherTaskCallback {
    void onClearCache();
    void onAddBitmapToCache(Integer position, Bitmap bitmap);
}
