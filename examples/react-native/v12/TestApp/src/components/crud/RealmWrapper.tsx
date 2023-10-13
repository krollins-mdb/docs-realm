import React from 'react';
import {ScrollView} from 'react-native';
import {RealmProvider} from '@realm/react';

import {Read} from './Read';

import {Forest, Tree, GrowthLog, Note, Botanist} from '../../models';

const realmModels: Realm.RealmObjectConstructor[] = [
  Forest,
  Tree,
  GrowthLog,
  Note,
  Botanist,
];

export const Crud = () => {
  return (
    <ScrollView>
      <RealmProvider schema={realmModels} path="crud.realm">
        <Read />
      </RealmProvider>
    </ScrollView>
  );
};
