import React, {Component} from 'react';
import {Share, Button} from 'react-native';

export default class ShareExample extends Component {
  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'BAM: we\'re helping your business with awesome React Native apps',
        url: 'http://bam.tech',
        title: 'Wow, did you see that?'
      }, {
        // Android only:
        dialogTitle: 'Share BAM goodness',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return <Button onPress={this.onShare} title="Share" />;
  }
}
