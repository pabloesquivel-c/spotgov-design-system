# Component manifest

> **Auto-generated** — do not edit by hand. Run `npm run generate:manifest` after adding primitives or blocks.
>
> Generated: 2026-07-14 · 58 primitives · 22 block categories · 25 canonical block exports

Agent-facing inventory for SpotGov product UI. Pair with [`AGENTS.md`](../AGENTS.md), [`design-system.md`](./design-system.md) §8 (which-one-when), and [`component-patterns.md`](./component-patterns.md).

**Import primitives:** `@/components/ui/<name>` · **Import blocks:** `@/components/blocks/<category>` · **Catalog:** `/storybook`

---

## Primitives (`components/ui/`)

| Primitive | Import | Purpose | Avoid | Storybook |
|-----------|--------|---------|-------|-----------|
| `accordion` | `@/components/ui/accordion` | Collapsible sections | Primary nav | `UI/Accordion` |
| `alert` | `@/components/ui/alert` | Inline page/message banners | Field-level errors (use hint) | `UI/Alert` |
| `avatar-empty-icons` | `@/components/ui/avatar-empty-icons` | Empty avatar placeholders | Custom SVG people | `UI/AvatarEmptyIcons` |
| `avatar-group-compact` | `@/components/ui/avatar-group-compact` | Dense avatar stack | — | `UI/AvatarGroupCompact` |
| `avatar-group` | `@/components/ui/avatar-group` | Stacked people | Single user | `UI/AvatarGroup` |
| `avatar` | `@/components/ui/avatar` | User/org identity | Decorative-only without name | `UI/Avatar` |
| `badge.figma` | `@/components/ui/badge.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/Badge.figma` |
| `badge` | `@/components/ui/badge` | Category, count, tag label | Workflow state | `UI/Badge` |
| `banner.figma` | `@/components/ui/banner.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/Banner.figma` |
| `banner` | `@/components/ui/banner` | Full-width persistent announcement bar | Inline alerts (use alert) | `UI/Banner` |
| `breadcrumb` | `@/components/ui/breadcrumb` | Hierarchy | Deep primary nav | `UI/Breadcrumb` |
| `button-group` | `@/components/ui/button-group` | Segmented actions | Single CTA | `UI/ButtonGroup` |
| `button.figma` | `@/components/ui/button.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/Button.figma` |
| `button` | `@/components/ui/button` | Actions | Links, icon-only rows | `UI/Button` |
| `checkbox` | `@/components/ui/checkbox` | Multi-select, table select | Mutually exclusive choices | `UI/Checkbox` |
| `color-picker` | `@/components/ui/color-picker` | Color input | Simple hex field | `UI/ColorPicker` |
| `command-menu` | `@/components/ui/command-menu` | Cmd+K palette | Simple search input | `UI/CommandMenu` |
| `compact-button` | `@/components/ui/compact-button` | Icon-only row/toolbar actions | Primary CTA | `UI/CompactButton` |
| `datepicker` | `@/components/ui/datepicker` | Date/range pick | Free-text dates | `UI/Datepicker` |
| `digit-input` | `@/components/ui/digit-input` | OTP codes | Long numbers | `UI/DigitInput` |
| `divider` | `@/components/ui/divider` | In-card separators | Page sections | `UI/Divider` |
| `dot-stepper` | `@/components/ui/dot-stepper` | Step indicator dots | Labeled steps | `UI/DotStepper` |
| `drawer` | `@/components/ui/drawer` | Side panel shell | Quick confirm | `UI/Drawer` |
| `dropdown` | `@/components/ui/dropdown` | Action menus | Main nav | `UI/Dropdown` |
| `fancy-button` | `@/components/ui/fancy-button` | Auth primary submit | Toolbar actions | `UI/FancyButton` |
| `file-format-icon` | `@/components/ui/file-format-icon` | File type glyph | Generic file icon | `UI/FileFormatIcon` |
| `file-upload` | `@/components/ui/file-upload` | Upload control | Custom dropzone div | `UI/FileUpload` |
| `hint` | `@/components/ui/hint` | Helper/error under field | Page-level alert | `UI/Hint` |
| `horizontal-stepper` | `@/components/ui/horizontal-stepper` | Wizard steps | Vertical flows | `UI/HorizontalStepper` |
| `input.figma` | `@/components/ui/input.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/Input.figma` |
| `input` | `@/components/ui/input` | Text fields | Multi-line text | `UI/Input` |
| `kbd` | `@/components/ui/kbd` | Shortcut display | Body copy | `UI/Kbd` |
| `label` | `@/components/ui/label` | Field labels | Headings | `UI/Label` |
| `link-button` | `@/components/ui/link-button` | Inline tertiary action | Submit actions | `UI/LinkButton` |
| `modal.figma` | `@/components/ui/modal.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/Modal.figma` |
| `modal` | `@/components/ui/modal` | Dialog, confirm, form modal | Full-height panel | `UI/Modal` |
| `notification` | `@/components/ui/notification` | Radix toast (stacked) | Compact sonner toast | `UI/Notification` |
| `pagination` | `@/components/ui/pagination` | Table pages | Infinite scroll only | `UI/Pagination` |
| `popover` | `@/components/ui/popover` | Anchored content | Modal task | `UI/Popover` |
| `progress-bar` | `@/components/ui/progress-bar` | Linear progress | Indeterminate without label | `UI/ProgressBar` |
| `progress-circle` | `@/components/ui/progress-circle` | Circular progress | — | `UI/ProgressCircle` |
| `radio` | `@/components/ui/radio` | Single-select | Multi-select | `UI/Radio` |
| `rating` (+ svg-rating-icons) | `@/components/ui/rating` | Star display + interactive input | Custom star markup | `UI/Rating` |
| `segmented-control` | `@/components/ui/segmented-control` | Mode toggle | Main nav tabs | `UI/SegmentedControl` |
| `select` | `@/components/ui/select` | Native-style select | 2-option toggle | `UI/Select` |
| `slider` | `@/components/ui/slider` | Range input | — | `UI/Slider` |
| `social-button` | `@/components/ui/social-button` | OAuth | Regular actions | `UI/SocialButton` |
| `status-badge.figma` | `@/components/ui/status-badge.figma` | AlignUI primitive — see design-system.md §5 | — | `UI/StatusBadge.figma` |
| `status-badge` | `@/components/ui/status-badge` | Workflow state | Categories | `UI/StatusBadge` |
| `switch` | `@/components/ui/switch` | On/off setting | Immediate action button | `UI/Switch` |
| `tab-menu-horizontal` | `@/components/ui/tab-menu-horizontal` | Section tabs | Vertical lists | `UI/TabMenuHorizontal` |
| `tab-menu-vertical` | `@/components/ui/tab-menu-vertical` | Side tab list | — | `UI/TabMenuVertical` |
| `table` | `@/components/ui/table` | Data grid | Card list for 20+ columns | `UI/Table` |
| `tag` | `@/components/ui/tag` | Removable label | Status | `UI/Tag` |
| `textarea` | `@/components/ui/textarea` | Multi-line text | Single-line input | `UI/Textarea` |
| `toast` (+ toast-alert) | `@/components/ui/toast` | Sonner host + toast.custom() API | Radix notification stack | `UI/Toast` |
| `tooltip` | `@/components/ui/tooltip` | Hover/focus supplement | Required instructions | `UI/Tooltip` |
| `vertical-stepper` | `@/components/ui/vertical-stepper` | Vertical wizard | — | `UI/VerticalStepper` |

---

## Canonical blocks (prefer for product UI)

| Export | Import | Purpose | Storybook |
|--------|--------|---------|-----------|
| `CreateAccountAuthCard` | `@/components/blocks/auth` | Auth card patterns | `Blocks/Auth` |
| `LoginAuthCard` | `@/components/blocks/auth` | Auth card patterns | `Blocks/Auth` |
| `ProductAnnouncementBanner` | `@/components/blocks/banner` | Product announcement bars | `Blocks/Banner` |
| `CheckboxCardHeader` | `@/components/blocks/checkbox` | Settings cards and preference groups | `Blocks/Checkbox` |
| `CheckboxCardShell` | `@/components/blocks/checkbox` | Settings cards and preference groups | `Blocks/Checkbox` |
| `FinanceCommandMenu` | `@/components/blocks/command-menu` | Command palette patterns | `Blocks/CommandMenu` |
| `SupportDrawer` | `@/components/blocks/drawer` | Side panels | `Blocks/Drawer` |
| `EmptyState` | `@/components/blocks/empty-state` | Missing data / zero-results surfaces | `Blocks/Empty State` |
| `FileUploadStatusCards` | `@/components/blocks/file-upload` | Upload flows and file status | `Blocks/FileUpload` |
| `FilterNavItem` | `@/components/blocks/filter` | Filter panels and settings nav | `Blocks/Filter` |
| `FilterPanelFooter` | `@/components/blocks/filter` | Filter panels and settings nav | `Blocks/Filter` |
| `FilterPanelHeader` | `@/components/blocks/filter` | Filter panels and settings nav | `Blocks/Filter` |
| `FilterPanelShell` | `@/components/blocks/filter` | Filter panels and settings nav | `Blocks/Filter` |
| `FilterSearchField` | `@/components/blocks/filter` | Filter panels and settings nav | `Blocks/Filter` |
| `DestructiveConfirmModal` | `@/components/blocks/modal` | Dialogs and confirmations | `Blocks/Modal` |
| `SkeletonSidebar` | `@/components/blocks/sidebar` | Primary app navigation shell | `Blocks/Sidebar/Skeleton` |
| `NotificationPreferencesSwitch` | `@/components/blocks/switch` | Switch preference demos | `Blocks/Switch` |
| `BlockDataTable` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `ContractsTable` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `DocumentsTable` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `TableBlock` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `TableBlockFooter` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `TableBlockTabs` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `TableBlockToolbar` | `@/components/blocks/table` | Data tables and table chrome | `Blocks/Table` |
| `ChangePasswordForm` | `@/components/blocks/text-input` | Form input demos | `Blocks/Text Input` |

---

## Reference blocks (Storybook demos — adapt before shipping)

AlignUI catalog demos. Replace placeholder copy and prefer **canonical blocks** above for production. See [`component-conventions.md`](./component-conventions.md).

| Export | Category | Import | Notes |
|--------|----------|--------|-------|
| `AuthCardIconHeader` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `IconApple` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `IconGoogle` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `PasswordField` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `ResetPasswordAuthCard` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `VerificationCodeAuthCard` | `auth` | `@/components/blocks/auth` | Auth card patterns |
| `ProposalAiAnnouncementBanner` | `banner` | `@/components/blocks/banner` | Product announcement bars |
| `BarBreadcrumbs` | `breadcrumbs` | `@/components/blocks/breadcrumbs` | Breadcrumb variants (reference demos) |
| `DropdownBreadcrumbs` | `breadcrumbs` | `@/components/blocks/breadcrumbs` | Breadcrumb variants (reference demos) |
| `PillBreadcrumbs` | `breadcrumbs` | `@/components/blocks/breadcrumbs` | Breadcrumb variants (reference demos) |
| `SlashBreadcrumbs` | `breadcrumbs` | `@/components/blocks/breadcrumbs` | Breadcrumb variants (reference demos) |
| `AuthenticationSettingsCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `HrDashboardCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `HrModulesCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `HrServicesCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `MeetingLinkCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `MetricsFilterCheckboxPanel` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `PortfolioSharingCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `PrivacySettingsCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `SelectableCheckboxCards` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `TourPersonalizationCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `TransactionTableCheckbox` | `checkbox` | `@/components/blocks/checkbox` | Settings cards and preference groups |
| `BLUE` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `ColorPalette` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `ColorPickerEditor` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `GRAYSCALE` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `ModalColorPicker` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `SavedColorsColorPicker` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `SwatchPopoverColorPicker` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `THEME` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `TabbedColorPicker` | `color-picker` | `@/components/blocks/color-picker` | Color picker demos (reference) |
| `CommandMenuGrayTags` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `CommandMenuKeyboardFooter` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `CommandMenuScrollbar` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `CommandMenuSearchHeader` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `CommandMenuShortcutFooter` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `EmptyCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `HrHubCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `HrSidebarCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `MeetingsCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `PeopleDetailCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `PeopleSearchCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `SettingsSearchCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `UserProfileCommandMenu` | `command-menu` | `@/components/blocks/command-menu` | Command palette patterns |
| `DualRangeDatepicker` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `EventCalendarDatepicker` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `InlineRangeDatepicker` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `PopoverRangeDatepicker` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `PresetItem` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `PresetsContainer` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `SchedulingDatepicker` | `datepicker` | `@/components/blocks/datepicker` | Date picker demos (reference) |
| `ContactDetailsDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `ContentFiltersDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `EquityFiltersDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `GeneralSettingsDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `GoalDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `ProfileDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `ServiceFeeDrawer` | `drawer` | `@/components/blocks/drawer` | Side panels |
| `AccountPlanDropdown` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `AccountStorageDropdown` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `CheckboxFilterDropdown` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `MultiAccountDropdown` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `NavigationDropdown` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `VerifiedAvatarBadge` | `dropdown` | `@/components/blocks/dropdown` | Dropdown menus (reference demos) |
| `FilteredTendersEmptyState` | `empty-state` | `@/components/blocks/empty-state` | Missing data / zero-results surfaces |
| `NoSavedTendersEmptyState` | `empty-state` | `@/components/blocks/empty-state` | Missing data / zero-results surfaces |
| `AddWriterModal` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `AvatarUploadVariants` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `CsvImportModal` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `DesignSpaceSetupForm` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `FileUploadModal` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `MultiSourceUploadModal` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `ProfileImageUploadModal` | `file-upload` | `@/components/blocks/file-upload` | Upload flows and file status |
| `AccountsFilter` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `AmountFilter` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `CategoriesFilter` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `CustomerFilter` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `DateRangeFilter` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `FILTER` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `MonthRangePicker` | `filter` | `@/components/blocks/filter` | Filter panels and settings nav |
| `CustomizationModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `DeleteSavedSearchModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `EmailVerificationModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `ExploreSmartphonesModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `FeatureAnnouncementModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `PaymentReceivedModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `ServerMaintenanceModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `UploadWorkModal` | `modal` | `@/components/blocks/modal` | Dialogs and confirmations |
| `NotificationsPopover` | `notification` | `@/components/blocks/notification` | Notification popover demos (reference) |
| `ProfileCard` | `profile-card` | `@/components/blocks/profile-card` | Profile card demos (reference) |
| `DietaryPreferenceRadio` | `radio` | `@/components/blocks/radio` | Radio card demos (reference) |
| `ReportMessageRadio` | `radio` | `@/components/blocks/radio` | Radio card demos (reference) |
| `SecurityPrivacyRadio` | `radio` | `@/components/blocks/radio` | Radio card demos (reference) |
| `SelectableRadioCards` | `radio` | `@/components/blocks/radio` | Radio card demos (reference) |
| `AppSidebar` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `SkeletonAccountFooter` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `SkeletonHomeMock` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `SkeletonNotificationsDrawer` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `SkeletonWorkspaceToggle` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `mockSessionMultiOrg` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `mockSessionSingleOrg` | `sidebar` | `@/components/blocks/sidebar` | Primary app navigation shell |
| `WeeklyPromotionsSlider` | `slider` | `@/components/blocks/slider` | Slider demos (reference) |
| `CoursesTable` | `table` | `@/components/blocks/table` | Data tables and table chrome |
| `PayrollTable` | `table` | `@/components/blocks/table` | Data tables and table chrome |
| `ProjectsTable` | `table` | `@/components/blocks/table` | Data tables and table chrome |
| `TransactionsLedgerTable` | `table` | `@/components/blocks/table` | Data tables and table chrome |
| `AccountSetupModal` | `text-input` | `@/components/blocks/text-input` | Form input demos |
| `ContactInformationForm` | `text-input` | `@/components/blocks/text-input` | Form input demos |
| `InlineEditInput` | `text-input` | `@/components/blocks/text-input` | Form input demos |
| `SocialLinksForm` | `text-input` | `@/components/blocks/text-input` | Form input demos |
| `TextInputPanelHeader` | `text-input` | `@/components/blocks/text-input` | Form input demos |
| `DeviceStatsTooltip` | `tooltip` | `@/components/blocks/tooltip` | Tooltip demos (reference) |
| `MetricDetailTooltip` | `tooltip` | `@/components/blocks/tooltip` | Tooltip demos (reference) |
| `PasswordRequirementsTooltip` | `tooltip` | `@/components/blocks/tooltip` | Tooltip demos (reference) |
| `RiskReportTooltip` | `tooltip` | `@/components/blocks/tooltip` | Tooltip demos (reference) |
| `useTooltipSide` | `tooltip` | `@/components/blocks/tooltip` | Tooltip demos (reference) |
