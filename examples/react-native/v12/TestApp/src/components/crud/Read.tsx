import React, {useState} from 'react';
import {useQuery} from '@realm/react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import {
  CreateForest,
  CreateTree,
  CreateCaretaker,
  CreateGrowthLog,
} from './Create';

import {Forest, Tree, Botanist} from '../../models';

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

        {/* TODO: Refactor CreateForest as a modal */}
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
    <Pressable
      testID="manage-forest"
      style={styles.card}
      onPress={() => {
        setSelectedForest(forest);
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.deemphasize}>{type}</Text>
      </View>

      <View style={styles.cardInfo}>
        <View>
          <Text>{_id.toString()}</Text>
          <Text>Number of trees: {trees.length}</Text>
          <Text>Number of caretakers: {caretakers.length}</Text>
        </View>

        <Text style={styles.goForward}>{'>'}</Text>
      </View>
    </Pressable>
  );
};

const ForestView = ({forest, setSelectedForest}: ForestProps) => {
  const {_id, name, type, caretakers, trees} = forest;

  const [showCreateTree, setShowCreateTree] = useState(false);
  const [showAddCaretaker, setShowAddCaretaker] = useState(false);
  const [showCreateGrowthLog, setshowCreateGrowthLog] = useState(false);

  const [selectedTree, setSelectedTree] = useState<Tree>();
  const [selectedCaretaker, setSelectedCaretaker] = useState<Botanist>();

  return (
    <View>
      <View style={styles.navButtonGroup}>
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
        <Text style={styles.deemphasize}>{type}</Text>
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

        {/* TODO: Refactor CreateTree as a modal */}
        {showCreateTree && <CreateTree setShowCreateTree={setShowCreateTree} />}

        {!selectedTree ? (
          <ForestTrees trees={trees} setSelectedTree={setSelectedTree} />
        ) : (
          // TODO: abstract to component
          <View style={styles.card}>
            <View style={styles.navButtonGroup}>
              <Pressable
                style={styles.smallButton}
                onPress={() => {
                  setSelectedTree(undefined);
                }}>
                <Text>All trees</Text>
              </Pressable>

              {/* TODO: Add delete button logic */}
              <Pressable
                style={styles.smallButton}
                onPress={() => {
                  console.log('delete tree');
                }}>
                <Text>Delete tree</Text>
              </Pressable>

              {/* TODO: Move to tree title. Edit only the tree title. */}
              <Pressable
                style={styles.smallButton}
                onPress={() => {
                  console.log('update tree info');
                }}>
                <Text>Edit tree</Text>
              </Pressable>

              <Pressable
                style={styles.smallButton}
                onPress={() => {
                  setshowCreateGrowthLog(!showCreateGrowthLog);
                }}>
                <Text>Add log</Text>
              </Pressable>
            </View>

            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{selectedTree.species}</Text>
              <Text style={styles.deemphasize}>
                {selectedTree._id.toString()}
              </Text>
            </View>

            <View style={styles.cardInfo}>
              <View>
                {selectedTree.growthLogs.length ? (
                  <FlatList
                    data={selectedTree.growthLogs}
                    keyExtractor={item => item._id.toString()}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                      <View>
                        <View style={styles.viewHeader}>
                          <Text>{item.note?.title}</Text>
                          <Text>{item.date.toDateString()}</Text>
                        </View>

                        <View style={styles.wrap}>
                          <Text style={styles.growthLogDetail}>
                            Healthy: {item.note?.isHealthy.toString()}
                          </Text>
                          <Text style={styles.growthLogDetail}>
                            Height: {item.height}
                          </Text>
                          <Text style={styles.growthLogDetail}>
                            Trunk width: {item.trunkWidth}
                          </Text>
                        </View>

                        <Text style={styles.growthLogNote}>
                          {item.note?.fieldNote}
                        </Text>
                      </View>
                    )}
                  />
                ) : (
                  <Text>No growth logs for this tree</Text>
                )}
              </View>
            </View>

            {showCreateGrowthLog && (
              <CreateGrowthLog
                tree={selectedTree}
                showCreateGrowthLog={showCreateGrowthLog}
                setShowCreateGrowthLog={setshowCreateGrowthLog}
              />
            )}
          </View>
        )}
      </View>

      {/* TODO: simplify this section. No need for it to be as
          built-out as the tree stuff. */}
      {!selectedCaretaker ? (
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

          {/* TODO: Refactor CreateCaretaker as a modal */}
          {showAddCaretaker && (
            <CreateCaretaker setShowAddCaretaker={setShowAddCaretaker} />
          )}

          <ForestCaretakers
            caretakers={caretakers}
            setSelectedCaretaker={setSelectedCaretaker}
          />
        </View>
      ) : (
        <View>
          <Pressable
            style={styles.smallButton}
            onPress={() => {
              setSelectedCaretaker(undefined);
            }}>
            <Text>Back to all caretakers</Text>
          </Pressable>

          <Text>Caretaker view</Text>
        </View>
      )}
    </View>
  );
};

interface ForestTreesProps {
  trees: Tree[];
  setSelectedTree: React.Dispatch<React.SetStateAction<Tree | undefined>>;
}

const ForestTrees = ({trees, setSelectedTree}: ForestTreesProps) => {
  return (
    <View>
      {trees.length ? (
        <FlatList
          data={trees}
          keyExtractor={item => item._id.toString()}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              style={styles.listItem}
              onPress={() => {
                setSelectedTree(item);
              }}>
              <Text>
                {item.species} | {item._id.toString()}
              </Text>
              <Text style={styles.goForward}>{'>'}</Text>
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.listItem}>No trees in this forest</Text>
      )}
    </View>
  );
};

interface ForestCaretakersProps {
  caretakers: Botanist[];
  setSelectedCaretaker: React.Dispatch<
    React.SetStateAction<Botanist | undefined>
  >;
}

const ForestCaretakers = ({
  caretakers,
  setSelectedCaretaker,
}: ForestCaretakersProps) => {
  return (
    <View>
      {caretakers.length ? (
        <FlatList
          data={caretakers}
          keyExtractor={item => item._id.toString()}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              style={styles.listItem}
              onPress={() => {
                setSelectedCaretaker(item);
              }}>
              <Text>
                {item.name} | {item._id.toString()}
              </Text>
              <Text style={styles.goForward}>{'>'}</Text>
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.listItem}>No caretakers for this forest</Text>
      )}
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
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goForward: {
    fontSize: 28,
    fontWeight: '200',
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
  deemphasize: {
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  navButtonGroup: {
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
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  growthLogDetail: {
    fontWeight: '300',
  },
  growthLogNote: {
    marginTop: 12,
    marginBottom: 16,
  },
});
