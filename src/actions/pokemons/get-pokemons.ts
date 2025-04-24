import {pokeApi} from '../../config/api/pokeApi';
import type {Pokemon} from '../../domain/entities/pokemon';
import type {
  PokeAPIPaginatedResponse,
  PokeAPIPokemon,
} from '../../infrastructure/interfaces/pokeapi.interface';
import {PokemonMapper} from '../../infrastructure/mappers/pokemon.mapper';
export const getPokemons = async (
  page: number,
  limit: number = 20,
): Promise<Pokemon[]> => {
  try {
    const url = `/pokemon?offset=${page * limit}&limit=${limit}`;

    const data = await pokeApi.get<PokeAPIPaginatedResponse>(url);

    const pokemonPromises = data.data.results.map(info => {
      return pokeApi.get<PokeAPIPokemon>(info.url);
    });

    const pokeApiPokemons = await Promise.all(pokemonPromises);

    const pokemonsPromises = pokeApiPokemons.map(pokeApiPokemon =>
      PokemonMapper.pokeApiPokemonToEntity(pokeApiPokemon.data),
    );

    return Promise.all(pokemonsPromises);

    return [];
  } catch (error) {
    throw new Error('No se pudo obtener los pokemons');
  }
};
