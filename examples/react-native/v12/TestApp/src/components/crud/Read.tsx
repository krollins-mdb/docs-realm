import React, {useState} from 'react';
import {useQuery} from '@realm/react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import {CreateForest} from './Create';
import {CreateTree} from './Create';
import {CreateCaretaker} from './Create';

import {Forest, Tree, GrowthLog, Note, Botanist} from '../../models';

export const Read = () => {
  const [selectedForest, setSelectedForest] = useState<Forest>();
  const [showCreateForest, setShowCreateForest] = useState(false);
  const forests = useQuery(Forest);

  if (selectedForest) {
    return (
      <View style={styles.pageLayout}>
        <ForestView
          forest={selectedForest}
          setSelectedForest={setSelectedForest}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.pageLayout}>
        <View style={styles.viewHeader}>
          <Text style={styles.viewTitle}>All forests</Text>
          <Pressable
            testID="open-add-tree"
            style={styles.smallButton}
            onPress={() => {
              setShowCreateForest(!showCreateForest);
            }}>
            <Text>{showCreateForest ? 'Cancel' : 'Add forest'}</Text>
          </Pressable>
        </View>

        {showCreateForest && (
          <CreateForest setShowCreateForest={setShowCreateForest} />
        )}

        {forests.length ? (
          <FlatList
            data={forests}
            keyExtractor={item => item._id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              <ForestCard forest={item} setSelectedForest={setSelectedForest} />
            )}
          />
        ) : (
          <Text>No forests added yet</Text>
        )}
      </View>
    );
  }
};

interface ForestProps {
  forest: Forest;
  setSelectedForest: React.Dispatch<React.SetStateAction<Forest | undefined>>;
}

const ForestCard = ({forest, setSelectedForest}: ForestProps) => {
  const {_id, name, type, caretakers, trees} = forest;

  return (
    <View style={styles.forestCard}>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.forestType}>{type}</Text>
        </View>

        <Text>{_id.toString()}</Text>
        <Text>Number of trees: {trees.length}</Text>
        <Text>Number of caretakers: {caretakers.length}</Text>
      </View>

      <View style={styles.buttonGroupNoMargin}>
        <Pressable
          testID="manage-forest"
          style={styles.smallButton}
          onPress={() => {
            setSelectedForest(forest);
          }}>
          <Text>Manage forest</Text>
        </Pressable>
      </View>
    </View>
  );
};

const ForestView = ({forest, setSelectedForest}: ForestProps) => {
  const {_id, name, type, caretakers, trees} = forest;

  const [showCreateTree, setShowCreateTree] = useState(false);
  const [showAddCaretaker, setShowAddCaretaker] = useState(false);

  return (
    <View>
      <View style={styles.topNavButtonGroup}>
        <Pressable
          style={styles.smallButton}
          onPress={() => {
            setSelectedForest(undefined);
          }}>
          <Text>See all forests</Text>
        </Pressable>
      </View>

      <View style={styles.viewHeader}>
        <Text style={styles.viewTitle}>{name}</Text>
        <Text style={styles.forestType}>{type}</Text>
      </View>

      <Text style={styles.forestId}>{_id.toString()}</Text>

      <View style={styles.viewSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trees in forest</Text>
          <Pressable
            testID="open-add-tree"
            style={styles.smallButton}
            onPress={() => {
              setShowCreateTree(!showCreateTree);
            }}>
            <Text>{showCreateTree ? 'Cancel' : 'Add tree'}</Text>
          </Pressable>
        </View>

        {showCreateTree && <CreateTree setShowCreateTree={setShowCreateTree} />}

        {trees.length ? (
          <FlatList
            data={trees}
            keyExtractor={item => item._id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              // TODO: Add navigation to tree view
              // TODO: Add delete button
              <View style={styles.listItem}>
                <Text>
                  {item.species} | {item._id.toString()}
                </Text>
                <Pressable
                  style={styles.smallNavButton}
                  onPress={() => {
                    console.debug('nav to tree view');
                  }}>
                  <Text>Edit</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text style={styles.listItem}>No trees in this forest</Text>
        )}
      </View>

      <View style={styles.viewSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Forest caretakers</Text>
          <Pressable
            testID="open-add-caretaker"
            style={styles.smallButton}
            onPress={() => {
              setShowAddCaretaker(!showAddCaretaker);
            }}>
            <Text>{showAddCaretaker ? 'Cancel' : 'Add caretaker'}</Text>
          </Pressable>
        </View>

        {showAddCaretaker && (
          <CreateCaretaker setShowAddCaretaker={setShowAddCaretaker} />
        )}

        {caretakers.length ? (
          <FlatList
            data={caretakers}
            keyExtractor={item => item._id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              // TODO: Add navigation to caretaker view
              // TODO: Add delete button
              <View style={styles.listItem}>
                <Text>
                  {item.name} | {item._id.toString()}
                </Text>
                <Pressable
                  style={styles.smallNavButton}
                  onPress={() => {
                    console.debug('nav to caretaker view');
                  }}>
                  <Text>Edit</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text style={styles.listItem}>No caretakers for this forest</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageLayout: {
    paddingVertical: 12,
    marginHorizontal: 12,
  },
  viewTitle: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  forestCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardInfo: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  forestType: {
    fontStyle: 'italic',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  forestId: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    fontWeight: '300',
  },
  viewHeader: {
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  viewSection: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingVertical: 8,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroupNoMargin: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNavButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  smallNavButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
