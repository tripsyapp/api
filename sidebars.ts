import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  apiSidebar: [
    'intro',
    'authentication',
    'oauth2',
    'accounts',
    'storage-uploads',
    'email-and-inbox',
    'trips',
    {
      type: 'category',
      label: 'Trip subresources',
      collapsed: false,
      items: [
        'hostings',
        'activities',
        'transportations',
        'expenses-and-collaborators',
        'documents',
      ],
    },
    'shared-objects',
    'errors',
  ],
};

export default sidebars;
