import React, {useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, Text, TextInput} from 'react-native-paper';
import {Pokemon} from '../../../domain/entities/pokemon';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {useQuery} from '@tanstack/react-query';
import {
  getPokemonsByIds,
  getPokemonsNamesWithId,
} from '../../../actions/pokemons';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {useDebounceValue} from '../../hooks/useDebounceValue';

export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();

  const [term, setTerm] = useState('');

  const debounceValue = useDebounceValue(term);

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonsNamesWithId(),
  });

  const pokemonNameIdList = useMemo(() => {
    // es un numero
    if (!isNaN(Number(debounceValue))) {
      const pokemon = pokemonNameList.filter(
        pokemon => pokemon.id === Number(debounceValue),
      );
      return pokemon ? [...pokemon] : [];
    }
    if (debounceValue.length === 0) {
      return [];
    }

    if (debounceValue.length < 3) {
      return [];
    }

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debounceValue),
    );
  }, [debounceValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10}]}>
      <TextInput
        placeholder="Buscar pokemon"
        mode="flat"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />
      {isLoadingPokemons && <ActivityIndicator style={{marginTop: 20}} />}

      <FlatList
        data={pokemons as Pokemon[]}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{paddingTop: top + 20}}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 120}}></View>}
      />
    </View>
  );
};
