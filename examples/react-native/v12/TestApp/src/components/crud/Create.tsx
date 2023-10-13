import React, {useState} from 'react';
import {BSON} from 'realm';
import {useRealm, useQuery} from '@realm/react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from 'react-native';

import {Forest, Tree, GrowthLog, Note, Botanist} from '../../models';

interface CreateForestProps {
  setShowCreateForest: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateForest = ({setShowCreateForest}: CreateForestProps) => {
  const realm = useRealm();

  const [forestName, setForestName] = useState('');
  const [forestType, setForestType] = useState('');

  const createForest = ({name, type}: {name: string; type: string}): void => {
    realm.write(() => {
      realm.create(Forest, {
        _id: new BSON.ObjectID(),
        name: name,
        caretakers: [],
        trees: [],
        type: type,
      });
    });

    setShowCreateForest(false);
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <TextInput
          testID={'forest-name-input'}
          onChangeText={setForestName}
          value={forestName}
          placeholder="Forest name..."
          style={styles.textInput}
        />
        <TextInput
          testID={'forest-type-input'}
          onChangeText={setForestType}
          value={forestType}
          placeholder="Forest type..."
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          testID="create-forest"
          style={styles.smallButton}
          onPress={() => {
            createForest({name: forestName, type: forestType});
          }}>
          <Text>Create forest</Text>
        </Pressable>
      </View>
    </View>
  );
};

interface CreateTreeProps {
  setShowCreateTree: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateTree = ({setShowCreateTree}: CreateTreeProps) => {
  const realm = useRealm();

  const [species, setSpecies] = useState('');
  const [forestName, setForestName] = useState('');
  const [caretaker, setCaretaker] = useState<Botanist>();

  const caretakers = useQuery(
    Botanist,
    botanists => {
      return botanists.filtered('forest.name == $0', forestName);
    },
    [forestName],
  );
  const forest = useQuery(
    Forest,
    forests => {
      return forests.filtered('name == $0', forestName);
    },
    [forestName],
  )[0];

  interface CreateForestProps {
    species: string;
    forest: Forest;
    caretaker?: Botanist;
  }

  const createTree = ({
    species,
    forest,
    caretaker,
  }: CreateForestProps): void => {
    realm.write(() => {
      const newTree = realm.create(Tree, {
        _id: new BSON.ObjectID(),
        species: species,
        forest: forest,
        growthLogs: [],
        assignedTo: caretaker,
      });

      forest.trees.push(newTree);

      setShowCreateTree(false);
    });
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <TextInput
          testID={'species-input'}
          onChangeText={setSpecies}
          value={species}
          placeholder="Species..."
          style={styles.textInput}
        />
        <TextInput
          testID={'forest-name-input'}
          onChangeText={setForestName}
          value={forestName}
          placeholder="Forest name..."
          style={styles.textInput}
        />
      </View>

      <View>
        <Text>(optional) Select a botanist to care for this tree</Text>
        {caretakers.length ? (
          <FlatList
            data={caretakers}
            keyExtractor={item => item._id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              <Pressable
                style={styles.botanist}
                onPress={() => {
                  setCaretaker(item);
                }}>
                {caretaker && caretaker.name == item.name ? (
                  <Text>✓</Text>
                ) : (
                  <Text> </Text>
                )}
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
        ) : (
          <Text>
            No caretakers found. Please add a caretaker for this forest.
          </Text>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          testID="create-tree"
          style={styles.smallButton}
          onPress={() => {
            createTree({
              species: species,
              forest: forest,
              caretaker: caretaker,
            });
          }}>
          <Text>Create tree</Text>
        </Pressable>
      </View>
    </View>
  );
};

interface CreateCaretakerProps {
  setShowAddCaretaker: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateCaretaker = ({
  setShowAddCaretaker,
}: CreateCaretakerProps) => {
  const realm = useRealm();

  const [name, setName] = useState('');
  const [forestName, setForestName] = useState('');

  const forest = useQuery(
    Forest,
    forests => {
      return forests.filtered('name == $0', forestName);
    },
    [forestName],
  )[0];

  interface CreateCaretakerProps {
    name: string;
    forest: Forest;
  }

  const createCaretaker = ({name, forest}: CreateCaretakerProps): void => {
    realm.write(() => {
      const newCaretaker = realm.create(Botanist, {
        _id: new BSON.ObjectID(),
        name: name,
        forest: forest,
        trees: [],
      });

      forest.caretakers.push(newCaretaker);

      setShowAddCaretaker(false);
    });
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <TextInput
          testID={'caretaker-name-input'}
          onChangeText={setName}
          value={name}
          placeholder="Caretaker name..."
          style={styles.textInput}
        />
        <TextInput
          testID={'caretaker-forest-name-input'}
          onChangeText={setForestName}
          value={forestName}
          placeholder="Forest name..."
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          testID="create-caretaker"
          style={styles.smallButton}
          onPress={() => {
            createCaretaker({name: name, forest: forest});
          }}>
          <Text>Create caretaker</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#C5CAE9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 5,
  },
  inputGroup: {
    width: '100%',
  },
  botanist: {
    flexDirection: 'row',
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
