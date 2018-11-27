package com.synconset;

import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;

import com.google.firebase.crash.FirebaseCrash;
import com.synconset.interfaces.ResizeImagesCallback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class ResizeImagesTask extends AsyncTask<Set<Map.Entry<String, Integer>>, Void, ArrayList<String>> {

    private Exception asyncTaskError = null;
    private static final int IMG_QUALITY = 100;
    private Cursor imagecursor;
    private ResizeImagesCallback resizeImagesCallback;

    public ResizeImagesTask(ResizeImagesCallback callback) {
        resizeImagesCallback = callback;
    }

    @Override
    protected ArrayList<String> doInBackground(Set<Map.Entry<String, Integer>>... fileSets) {
        Set<Map.Entry<String, Integer>> fileNames = fileSets[0];
        ArrayList<String> al = new ArrayList<String>();
        try {
            Iterator<Map.Entry<String, Integer>> i = fileNames.iterator();
            Bitmap bmp;
            while (i.hasNext()) {
                Map.Entry<String, Integer> imageInfo = i.next();
                File file = new File(imageInfo.getKey());
                int rotate = imageInfo.getValue();
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = 1;
                options.inJustDecodeBounds = true;
                BitmapFactory.decodeFile(file.getAbsolutePath(), options);
                try {
                    bmp = this.tryToGetBitmap(file, null, rotate, false);
                } catch (OutOfMemoryError e) {
                    options = new BitmapFactory.Options();
                    options.inSampleSize = 2;
                    try {
                        bmp = this.tryToGetBitmap(file, options, rotate, false);
                    } catch (OutOfMemoryError e2) {
                        options = new BitmapFactory.Options();
                        options.inSampleSize = 4;
                        try {
                            bmp = this.tryToGetBitmap(file, options, rotate, false);
                        } catch (OutOfMemoryError e3) {
                            throw new IOException("Unable to load image into memory.");
                        }
                    }
                }
                file = storeImage(bmp, file.getName());
                al.add(Uri.fromFile(file).toString());
            }
            return al;
        } catch (IOException e) {
            try {
                asyncTaskError = e;
                for (int i = 0; i < al.size(); i++) {
                    URI uri = new URI(al.get(i));
                    File file = new File(uri);
                    file.delete();
                }
            } catch (Exception ignore) {
            }
            return new ArrayList<String>();
        } catch (RuntimeException re) {
            FirebaseCrash.log("Runtime Exception :" + re.getMessage());
            return null;
        }
    }

    @Override
    protected void onPostExecute(ArrayList<String> al) {
        Intent data = new Intent();
        boolean resultOk;
        if (asyncTaskError != null) {
            Bundle res = new Bundle();
            res.putString("ERRORMESSAGE", asyncTaskError.getMessage());
            data.putExtras(res);
            resultOk = false;
        } else if (al.size() > 0) {
            Bundle res = new Bundle();
            res.putStringArrayList("MULTIPLEFILENAMES", al);
            if (imagecursor != null) {
                res.putInt("TOTALFILES", imagecursor.getCount());
            }
            data.putExtras(res);
            resultOk = true;
        } else {
            resultOk = false;
        }
        resizeImagesCallback.onResizeImagesResult(resultOk, data);
    }

    private Bitmap tryToGetBitmap(File file, BitmapFactory.Options options, int rotate, boolean shouldScale) throws IOException, OutOfMemoryError {
        Bitmap bmp;
        if (options == null) {
            bmp = BitmapFactory.decodeFile(file.getAbsolutePath());
        } else {
            bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), options);
        }

        if (bmp == null) {
            throw new IOException("The image file could not be opened.");
        }

        if (options != null && shouldScale) {
            bmp = this.getResizedBitmap(bmp, 1.0f);
        }

        if (rotate != 0) {
            Matrix matrix = new Matrix();
            matrix.setRotate(rotate);
            bmp = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), matrix, true);
        }

        return bmp;
    }

    private File storeImage(Bitmap bmp, String fileName) throws IOException {
        int index = fileName.lastIndexOf('.');
        String name = fileName.substring(0, index);
        String ext = fileName.substring(index);
        File file = File.createTempFile("tmp_" + name, ext);
        OutputStream outStream = new FileOutputStream(file);

        if (ext.compareToIgnoreCase(".png") == 0) {
            bmp.compress(Bitmap.CompressFormat.PNG, IMG_QUALITY, outStream);
        } else {
            bmp.compress(Bitmap.CompressFormat.JPEG, IMG_QUALITY, outStream);
        }
        outStream.flush();
        outStream.close();
        return file;
    }

    private Bitmap getResizedBitmap(Bitmap bm, float factor) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        Matrix matrix = new Matrix();
        matrix.postScale(factor, factor);
        return Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
    }
}