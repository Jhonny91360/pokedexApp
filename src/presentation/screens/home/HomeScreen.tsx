import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {getPokemons} from '../../../actions/pokemons';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {PokeballBG} from '../../components/pokemons/PokeballBG';
import {FlatList} from 'react-native-gesture-handler';
import {FAB, Text, useTheme} from 'react-native-paper';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {ThemeContext} from '../../context/ThemeContext';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();

  const {isDark} = useContext(ThemeContext);
  const theme = useTheme();

  const queryClient = useQueryClient();
  // Forma basica de una peticion http
  // const {isLoading, data: pokemons = []} = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 60 * 60 * 1000, //  1 hour
  // });

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);

      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon); // Load data in cache
      });
      return pokemons;
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
    staleTime: 60 * 60 * 1000, //  1 hour
  });

  console.log('data', data);
  return (
    <View style={globalTheme.globalMargin}>
      <PokeballBG style={styles.imgPosition}></PokeballBG>

      <FlatList
        data={data?.pages?.flat() ?? []}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{paddingTop: top + 20}}
        ListHeaderComponent={() => (
          <Text
            variant="displayMedium"
            style={{color: isDark ? 'white' : 'black'}}>
            Pokedex
          </Text>
        )}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        label="Buscar"
        style={[globalTheme.fab, {backgroundColor: theme.colors.primary}]}
        mode="elevated"
        onPress={() => navigation.push('SearchScreen')}
        color={theme.dark ? 'white' : 'black'}
      />
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
