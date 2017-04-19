package com.safer;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.auth0.lock.react.LockReactPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.surialabs.rn.geofencing.GeoFencingPackage;

import java.util.Arrays;
import java.util.List;

import com.rt2zz.reactnativecontacts.ReactNativeContacts; 

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new LockReactPackage(),
          new FIRMessagingPackage(),
          new ReactNativeContacts(),
          new GeoFencingPackage(),
          new RNGoogleSigninPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
