import React from 'react';

import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const Index = () => {
  return (
    <View>
      <Text className="text-3xl my-10 font-rubik">Welcome to ReState</Text>
      <Link href={"/sign-in"}>Sign In</Link>
      <Link href={"/explore"}>Explore</Link>
      <Link href={"/profile"}>Profile</Link>
      <Link href={"/properties/1"}>Property</Link>
    </View>
  )
}

export default Index;