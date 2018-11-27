package com.synconset;

import android.app.Activity;
import android.content.Intent;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;

public class ImagePicker extends CordovaPlugin {

    private CallbackContext callbackContext;

    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;
        final JSONObject params = args.getJSONObject(0);
        final Intent imagePickerIntent = new Intent(cordova.getActivity(), MultiImageChooserActivity.class);
        int max = 20;
        if (params.has("maximumImagesCount")) {
            max = params.getInt("maximumImagesCount");
        }
        imagePickerIntent.putExtra("MAX_IMAGES", max);
        cordova.startActivityForResult(this, imagePickerIntent, 0);
        return true;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            ArrayList<String> fileNames = data.getStringArrayListExtra("MULTIPLEFILENAMES");
            JSONArray res = new JSONArray(fileNames);
            callbackContext.success(res);
        } else if (resultCode == Activity.RESULT_CANCELED && data != null) {
            String error = data.getStringExtra("ERRORMESSAGE");
            callbackContext.error(error);
        } else if (resultCode == Activity.RESULT_CANCELED) {
            JSONArray res = new JSONArray();
            callbackContext.success(res);
        } else {
            callbackContext.error("No images selected");
        }
    }
}