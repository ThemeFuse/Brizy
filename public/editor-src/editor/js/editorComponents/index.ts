import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Accordion from "./Accordion";
import AccordionItem from "./Accordion/AccordionItem";
import Alert from "./Alert";
import AnimatedHeadline from "./AnimatedHeadline";
import Audio from "./Audio";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Button";
import Calendly from "./Calendly";
import Carousel from "./Carousel";
import Chart from "./Chart";
import Cloneable from "./Cloneable";
import Column from "./Column";
import Countdown from "./Countdown";
import Countdown2 from "./Countdown2";
import Counter from "./Counter";
import { ecwidLazyComponents } from "./Ecwid";
import EmbedCode from "./EmbedCode";
import Facebook from "./Facebook";
import FacebookButton from "./FacebookButton";
import FacebookComments from "./FacebookComments";
import FacebookEmbed from "./FacebookEmbed";
import FacebookGroup from "./FacebookGroup";
import FacebookPage from "./FacebookPage";
import Flipbox from "./Flipbox";
import FlipboxItem from "./Flipbox/FlipboxItem";
import Form from "./Form";
import Form2 from "./Form2";
import Form2Field from "./Form2/Form2Field";
import Form2FieldOption from "./Form2/Form2Field/types/FieldOption";
import Form2Fields from "./Form2/Form2Fields";
import Form2Step from "./Form2/Form2Step";
import Form2Steps from "./Form2/Form2Steps";
import FormField from "./Form/FormField";
import FormFields from "./Form/FormFields";
import GlobalBlock from "./GlobalBlock";
import Icon from "./Icon";
import IconText from "./IconText";
import Image from "./Image";
import ImageGallery from "./ImageGallery";
import InstagramFeed from "./InstagramFeed";
import Leadific from "./Leadific";
import Line from "./Line";
import LinkedinFeed from "./LinkedinFeed";
import Login from "./Login";
import ForgotPasswordField from "./Login/ForgotPasswordField";
import LoginField from "./Login/LoginField";
import RegisterField from "./Login/RegisterField";
import Lottie from "./Lottie";
import Map from "./Map";
import Menu from "./Menu";
import MenuItem from "./Menu/MenuItem";
import SectionMegaMenu from "./Menu/SectionMegaMenu";
import MenuSimple from "./MenuSimple";
import { ministryBrandsLazyComponents } from "./MinistryBrands";
import Page from "./Page";
import PagePopup from "./PagePopup";
import PageStory from "./PageStory";
import Paypal from "./Paypal";
import WPPostContent from "./PostContent";
import PostExcerpt from "./PostExcerpt";
import PostInfo from "./PostInfo";
import PostNavigation from "./PostNavigation";
import PostTitle from "./PostTitle";
import Posts from "./Posts";
import ProgressBar from "./ProgressBar";
import ProtectedPage from "./ProtectedPage";
import ResetPassword from "./ResetPassword";
import ResetPasswordField from "./ResetPassword/ResetPasswordField";
import RichText from "./RichText";
import Row from "./Row";
import Section from "./Section";
import SectionItem from "./Section/SectionItem";
import SectionFooter from "./SectionFooter";
import SectionHeader from "./SectionHeader";
import SectionHeaderItem from "./SectionHeader/SectionHeaderItem";
import SectionHeaderStickyItem from "./SectionHeader/SectionHeaderStickyItem";
import SectionPopup from "./SectionPopup";
import SectionPopup2 from "./SectionPopup2";
import Shape from "./Shape";
import ShareButton from "./ShareButton";
import ShareButtonItem from "./ShareButton/ShareButtonItem";
import { shopifyLazyComponents } from "./Shopify";
import SoundCloud from "./SoundCloud";
import Spacer from "./Spacer";
import StarRating from "./StarRating";
import Story from "./Story";
import StoryItem from "./Story/StoryItem";
import { StoryWrapper } from "./StoryWrapper";
import Switcher from "./Switcher";
import SwitcherTab from "./Switcher/SwitcherTab";
import Table from "./Table";
import TableAside from "./Table/TableAside";
import TableBody from "./Table/TableBody";
import TableCol from "./Table/TableCol";
import TableHead from "./Table/TableHead";
import TableRow from "./Table/TableRow";
import TableOfContents from "./TableOfContents";
import Tabs from "./Tabs";
import Tab from "./Tabs/Tab";
import ThirdParty from "./ThirdParty";
import Timeline from "./Timeline";
import TimelineTab from "./Timeline/TimelineTab";
import Translation from "./Translation";
import Twitter from "./Twitter";
import Video from "./Video";
import VideoPlaylist from "./VideoPlaylist";
import VideoPlaylistItem from "./VideoPlaylist/VideoPlaylistItem";
import Wrapper from "./Wrapper";

function getShortcodes(_config: ConfigCommon) {
  return {
    Page: {
      id: ElementTypes.Page,
      component: Page
    },
    PagePopup: {
      id: ElementTypes.PagePopup,
      component: PagePopup
    },
    PageStory: {
      id: ElementTypes.PageStory,
      component: PageStory
    },
    Section: {
      id: ElementTypes.Section,
      component: Section
    },
    SectionItem: {
      id: ElementTypes.SectionItem,
      component: SectionItem
    },
    Story: {
      id: ElementTypes.Story,
      component: Story
    },
    StoryItem: {
      id: ElementTypes.StoryItem,
      component: StoryItem
    },
    SectionHeader: {
      id: ElementTypes.SectionHeader,
      component: SectionHeader
    },
    SectionHeaderItem: {
      id: ElementTypes.SectionHeaderItem,
      component: SectionHeaderItem
    },
    SectionHeaderStickyItem: {
      id: ElementTypes.SectionHeaderStickyItem,
      component: SectionHeaderStickyItem
    },
    SectionFooter: {
      id: ElementTypes.SectionFooter,
      component: SectionFooter
    },
    Row: {
      id: ElementTypes.Row,
      component: Row
    },
    Column: {
      id: ElementTypes.Column,
      component: Column
    },
    AnimatedHeadline: {
      id: ElementTypes.AnimatedHeadline,
      component: AnimatedHeadline
    },
    Form: {
      id: ElementTypes.Form,
      component: Form
    },
    FormFields: {
      id: ElementTypes.FormFields,
      component: FormFields
    },
    FormField: {
      id: ElementTypes.FormField,
      component: FormField
    },
    Form2: {
      id: ElementTypes.Form2,
      component: Form2
    },
    Form2Fields: {
      id: ElementTypes.Form2Fields,
      component: Form2Fields
    },
    Form2Field: {
      id: ElementTypes.Form2Field,
      component: Form2Field
    },
    Form2Steps: {
      id: ElementTypes.Form2Steps,
      component: Form2Steps
    },
    Form2Step: {
      id: ElementTypes.Form2Step,
      component: Form2Step
    },
    Form2FieldOption: {
      id: ElementTypes.Form2FieldOption,
      component: Form2FieldOption
    },
    Wrapper: {
      id: ElementTypes.Wrapper,
      component: Wrapper
    },
    ProtectedPage: {
      id: ElementTypes.ProtectedPage,
      component: ProtectedPage
    },
    Cloneable: {
      id: ElementTypes.Cloneable,
      component: Cloneable
    },
    RichText: {
      id: ElementTypes.RichText,
      component: RichText
    },
    Audio: {
      id: ElementTypes.Audio,
      component: Audio
    },
    Video: {
      id: ElementTypes.Video,
      component: Video
    },
    VideoPlaylist: {
      id: ElementTypes.VideoPlaylist,
      component: VideoPlaylist
    },
    VideoPlaylistItem: {
      id: ElementTypes.VideoPlaylistItem,
      component: VideoPlaylistItem
    },
    Icon: {
      id: ElementTypes.Icon,
      component: Icon
    },
    Image: {
      id: ElementTypes.Image,
      component: Image
    },
    Line: {
      id: ElementTypes.Line,
      component: Line
    },
    Spacer: {
      id: ElementTypes.Spacer,
      component: Spacer
    },
    EmbedCode: {
      id: ElementTypes.EmbedCode,
      component: EmbedCode
    },
    Map: {
      id: ElementTypes.Map,
      component: Map
    },
    Button: {
      id: ElementTypes.Button,
      component: Button
    },
    Counter: {
      id: ElementTypes.Counter,
      component: Counter
    },
    SoundCloud: {
      id: ElementTypes.SoundCloud,
      component: SoundCloud
    },
    ProgressBar: {
      id: ElementTypes.ProgressBar,
      component: ProgressBar
    },
    IconText: {
      id: ElementTypes.IconText,
      component: IconText
    },
    Countdown: {
      id: ElementTypes.Countdown,
      component: Countdown
    },
    Countdown2: {
      id: ElementTypes.Countdown2,
      component: Countdown2
    },
    Tabs: {
      id: ElementTypes.Tabs,
      component: Tabs
    },
    Tab: {
      id: ElementTypes.Tab,
      component: Tab
    },
    Timeline: {
      id: ElementTypes.Timeline,
      component: Timeline
    },
    TimelineTab: {
      id: ElementTypes.TimelineTab,
      component: TimelineTab
    },
    Switcher: {
      id: ElementTypes.Switcher,
      component: Switcher
    },
    SwitcherTab: {
      id: ElementTypes.SwitcherTab,
      component: SwitcherTab
    },
    Table: {
      id: ElementTypes.Table,
      component: Table
    },
    TableBody: {
      id: ElementTypes.TableBody,
      component: TableBody
    },
    TableHead: {
      id: ElementTypes.TableHead,
      component: TableHead
    },
    TableAside: {
      id: ElementTypes.TableAside,
      component: TableAside
    },
    TableRow: {
      id: ElementTypes.TableRow,
      component: TableRow
    },
    TableCol: {
      id: ElementTypes.TableCol,
      component: TableCol
    },
    Accordion: {
      id: ElementTypes.Accordion,
      component: Accordion
    },
    AccordionItem: {
      id: ElementTypes.AccordionItem,
      component: AccordionItem
    },
    GlobalBlock: {
      id: ElementTypes.GlobalBlock,
      component: GlobalBlock
    },
    ImageGallery: {
      id: ElementTypes.ImageGallery,
      component: ImageGallery
    },
    SectionPopup: {
      id: ElementTypes.SectionPopup,
      component: SectionPopup
    },
    SectionPopup2: {
      id: ElementTypes.SectionPopup2,
      component: SectionPopup2
    },
    Carousel: {
      id: ElementTypes.Carousel,
      component: Carousel
    },
    StarRating: {
      id: ElementTypes.StarRating,
      component: StarRating
    },
    MenuSimple: {
      id: ElementTypes.WPNavigation,
      component: MenuSimple
    },
    Login: {
      id: ElementTypes.Login,
      component: Login
    },
    LoginField: {
      id: ElementTypes.LoginField,
      component: LoginField
    },
    RegisterField: {
      id: ElementTypes.RegisterField,
      component: RegisterField
    },
    ForgotPasswordField: {
      id: ElementTypes.ForgotPasswordField,
      component: ForgotPasswordField
    },
    ResetPassword: {
      id: ElementTypes.ResetPassword,
      component: ResetPassword
    },
    ResetPasswordField: {
      id: ElementTypes.ResetPasswordField,
      component: ResetPasswordField
    },
    Menu: {
      id: ElementTypes.Menu,
      component: Menu
    },
    MenuItem: {
      id: ElementTypes.MenuItem,
      component: MenuItem
    },
    SectionMegaMenu: {
      id: ElementTypes.SectionMegaMenu,
      component: SectionMegaMenu
    },
    Facebook: {
      id: ElementTypes.Facebook,
      component: Facebook
    },
    FacebookButton: {
      id: ElementTypes.FacebookButton,
      component: FacebookButton
    },
    FacebookComments: {
      id: ElementTypes.FacebookComments,
      component: FacebookComments
    },
    FacebookEmbed: {
      id: ElementTypes.FacebookEmbed,
      component: FacebookEmbed
    },
    FacebookPage: {
      id: ElementTypes.FacebookPage,
      component: FacebookPage
    },
    FacebookGroup: {
      id: ElementTypes.FacebookGroup,
      component: FacebookGroup
    },
    Twitter: {
      id: ElementTypes.Twitter,
      component: Twitter
    },
    Lottie: {
      id: ElementTypes.Lottie,
      component: Lottie
    },
    StoryWrapper: {
      id: ElementTypes.StoryWrapper,
      component: StoryWrapper
    },
    Shape: {
      id: ElementTypes.Shape,
      component: Shape
    },
    Translation: {
      id: ElementTypes.Translation,
      component: Translation
    },
    Calendly: {
      id: ElementTypes.Calendly,
      component: Calendly
    },
    Alert: {
      id: ElementTypes.Alert,
      component: Alert
    },
    TableOfContents: {
      id: ElementTypes.TableOfContents,
      component: TableOfContents
    },
    Flipbox: {
      id: ElementTypes.Flipbox,
      component: Flipbox
    },
    FlipboxItem: {
      id: ElementTypes.FlipboxItem,
      component: FlipboxItem
    },
    ThirdParty: {
      id: ElementTypes.ThirdParty,
      component: ThirdParty
    },
    ShareButton: {
      id: ElementTypes.ShareButton,
      component: ShareButton
    },
    ShareButtonItem: {
      id: ElementTypes.ShareButtonItem,
      component: ShareButtonItem
    },
    Paypal: {
      id: ElementTypes.Paypal,
      component: Paypal
    },
    InstagramFeed: {
      id: ElementTypes.InstagramFeed,
      component: InstagramFeed
    },
    LinkedinFeed: {
      id: ElementTypes.LinkedinFeed,
      component: LinkedinFeed
    },
    Chart: {
      id: ElementTypes.Chart,
      component: Chart
    },

    // DC
    PostTitle: {
      id: ElementTypes.PostTitle,
      component: PostTitle
    },
    PostExcerpt: {
      id: ElementTypes.PostExcerpt,
      component: PostExcerpt
    },
    PostInfo: {
      id: ElementTypes.PostInfo,
      component: PostInfo
    },
    Breadcrumbs: {
      id: ElementTypes.Breadcrumbs,
      component: Breadcrumbs
    },
    Posts: {
      id: ElementTypes.Posts,
      component: Posts
    },
    WPPostContent: {
      id: ElementTypes.WPPostContent,
      component: WPPostContent
    },
    PostNavigation: {
      id: ElementTypes.PostNavigation,
      component: PostNavigation
    },

    // Shopify
    ...shopifyLazyComponents,

    // Ecwid
    ...ecwidLazyComponents,

    // Ministry Brands
    ...ministryBrandsLazyComponents,

    // Leadific
    Leadific: {
      id: ElementTypes.Leadific,
      component: Leadific
    }
  };
}

export default getShortcodes;

export { NotFound as NotFoundComponent } from "./NotFound";

export {
  shopifyLazyComponents,
  ecwidLazyComponents,
  ministryBrandsLazyComponents
};
