import React, {useState} from 'react';
import {BSON} from 'realm';
import {useRealm, useQuery} from '@realm/react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
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
  const [selectedForest, setSelectedForest] = useState<Forest | undefined>();

  const forests = useQuery(Forest);

  interface CreateCaretakerProps {
    name: string;
    forest: Forest | undefined;
  }

  const createCaretaker = ({name, forest}: CreateCaretakerProps): void => {
    if (forest == undefined) {
      return;
    }

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
        {forests.length ? (
          <FlatList
            data={forests}
            keyExtractor={item => item._id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              <Pressable
                style={styles.botanist}
                onPress={() => {
                  setSelectedForest(item);
                }}>
                {selectedForest && selectedForest.name == item.name ? (
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
          testID="create-caretaker"
          style={styles.smallButton}
          onPress={() => {
            createCaretaker({name: name, forest: selectedForest});
          }}>
          <Text>Create caretaker</Text>
        </Pressable>
      </View>
    </View>
  );
};

interface CreateGrowthLogProps {
  showCreateGrowthLog: boolean;
  setShowCreateGrowthLog: React.Dispatch<React.SetStateAction<boolean>>;
  tree: Tree;
}

export const CreateGrowthLog = ({
  tree,
  showCreateGrowthLog,
  setShowCreateGrowthLog,
}: CreateGrowthLogProps) => {
  const realm = useRealm();

  const [id] = useState(new BSON.ObjectID());
  const [date] = useState(new Date());

  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isHealthy, setIsHealthy] = useState<boolean | undefined>();
  const [imageUri, setImageUri] = useState<string | undefined>();

  const createGrowthLog = (height: string, width: string) => {
    realm.write(() => {
      const newNote = {
        title: noteTitle,
        fieldNote: noteBody,
        imageUri: imageUri,
        isHealthy: isHealthy!,
      };

      const newGrowthLog = realm.create(GrowthLog, {
        _id: id,
        date: date,
        height: Number(height),
        trunkWidth: Number(width),
        note: newNote as Note,
      });

      tree.growthLogs.push(newGrowthLog);

      setShowCreateGrowthLog(false);
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCreateGrowthLog}
      onRequestClose={() => {
        setShowCreateGrowthLog(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.sectionTitle}>Required</Text>
          <Text>ID: {id.toString()}</Text>
          <Text>Date: {date.toDateString()}</Text>

          <View style={styles.inputGroup}>
            <TextInput
              testID={'height-input'}
              onChangeText={setHeight}
              value={height}
              placeholder="Tree height..."
              style={styles.textInput}
            />
            <TextInput
              testID={'width-input'}
              onChangeText={setWidth}
              value={width}
              placeholder="Trunk width..."
              style={styles.textInput}
            />

            <Text style={[styles.sectionTitle, styles.increasedMargin]}>
              Add notes
            </Text>

            <View style={styles.inlineButtons}>
              <Text>Is tree healthy?</Text>
              <View style={styles.inlineButtonGroup}>
                <Pressable
                  style={[styles.smallButton, isHealthy && styles.healthy]}
                  onPress={() => {
                    setIsHealthy(true);
                  }}>
                  <Text style={isHealthy && styles.healthTextHighlight}>
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.smallButton, !isHealthy && styles.unhealthy]}
                  onPress={() => {
                    setIsHealthy(false);
                  }}>
                  <Text style={!isHealthy && styles.healthTextHighlight}>
                    No
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                testID={'note-title-input'}
                onChangeText={setNoteTitle}
                value={noteTitle}
                placeholder="Note title..."
                style={styles.textInput}
              />

              <TextInput
                testID={'note-body-input'}
                onChangeText={setNoteBody}
                value={noteBody}
                placeholder="Notes..."
                multiline={true}
                style={styles.textInput}
              />
            </View>

            <Text style={[styles.sectionTitle, styles.increasedMargin]}>
              Add image (optional)
            </Text>

            <TextInput
              testID={'note-image-input'}
              onChangeText={setImageUri}
              value={imageUri}
              placeholder="Image URI..."
              style={styles.textInput}
            />
          </View>

          <View style={styles.buttonGroup}>
            <Pressable
              style={styles.smallButton}
              onPress={() => {
                setShowCreateGrowthLog(false);
              }}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.smallButton}
              onPress={() => {
                createGrowthLog(height, width);
              }}>
              <Text>Create new growth log</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inlineButtonGroup: {
    flexDirection: 'row',
    marginHorizontal: 12,
  },
  inlineButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  increasedMargin: {
    marginTop: 22,
  },
  healthy: {
    backgroundColor: 'green',
  },
  unhealthy: {
    backgroundColor: 'orange',
  },
  healthTextHighlight: {
    color: 'white',
  },
});
