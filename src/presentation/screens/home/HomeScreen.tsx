import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import {getPokemons} from '../../../actions/pokemons';
import {useQuery} from '@tanstack/react-query';
import {PokeballBG} from '../../components/pokemons/PokeballBG';

export const HomeScreen = () => {
  const {isLoading, data = []} = useQuery({
    queryKey: ['pokemons'],
    queryFn: () => getPokemons(0),
    staleTime: 60 * 60 * 1000, //  1 hour
  });

  return (
    <View>
      <PokeballBG style={styles.imgPosition}></PokeballBG>
    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
});
