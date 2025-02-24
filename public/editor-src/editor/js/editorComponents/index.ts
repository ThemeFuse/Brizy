import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import Accordion from "./Accordion";
import AccordionItem from "./Accordion/AccordionItem";
import Alert from "./Alert";
import Audio from "./Audio";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Button";
import Calendly from "./Calendly";
import Carousel from "./Carousel";
import Cloneable from "./Cloneable";
import Column from "./Column";
import Countdown from "./Countdown";
import Countdown2 from "./Countdown2";
import Counter from "./Counter";
import * as Ecwid from "./Ecwid";
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
import * as MinistryBrands from "./MinistryBrands";
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
import * as Shopify from "./Shopify";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShortcodes(_config: ConfigCommon) {
  return {
    Page,
    PagePopup,
    PageStory,
    Section,
    SectionItem,
    Story,
    StoryItem,
    SectionHeader,
    SectionHeaderItem,
    SectionHeaderStickyItem,
    SectionFooter,
    Row,
    Column,
    Form,
    FormFields,
    FormField,
    Form2,
    Form2Fields,
    Form2Field,
    Form2Steps,
    Form2Step,
    Form2FieldOption,
    Wrapper,
    ProtectedPage,
    Cloneable,
    RichText,
    Audio,
    Video,
    VideoPlaylist,
    VideoPlaylistItem,
    Icon,
    Image,
    Line,
    Spacer,
    EmbedCode,
    Map,
    Button,
    Counter,
    SoundCloud,
    ProgressBar,
    IconText,
    Countdown,
    Countdown2,
    Tabs,
    Tab,
    Timeline,
    TimelineTab,
    Switcher,
    SwitcherTab,
    Table,
    TableBody,
    TableHead,
    TableAside,
    TableRow,
    TableCol,
    Accordion,
    AccordionItem,
    GlobalBlock,
    ImageGallery,
    SectionPopup,
    SectionPopup2,
    Carousel,
    StarRating,
    MenuSimple,
    Login,
    LoginField,
    RegisterField,
    ForgotPasswordField,
    ResetPassword,
    ResetPasswordField,
    Menu,
    MenuItem,
    SectionMegaMenu,
    Facebook,
    FacebookButton,
    FacebookComments,
    FacebookEmbed,
    FacebookPage,
    FacebookGroup,
    Twitter,
    Lottie,
    StoryWrapper,
    Shape,
    Translation,
    Calendly,
    Alert,
    TableOfContents,
    Flipbox,
    FlipboxItem,
    ThirdParty,
    ShareButton,
    ShareButtonItem,
    Paypal,
    InstagramFeed,
    LinkedinFeed,

    // DC
    PostTitle,
    PostExcerpt,
    PostInfo,
    Breadcrumbs,
    Posts,
    WPPostContent,
    PostNavigation,

    // Shopify
    ...Shopify,

    // Ecwid
    ...Ecwid,

    // Ministry Brands
    ...MinistryBrands,

    // Leadific
    Leadific
  };
}
export default getShortcodes;

export { NotFound as NotFoundComponent } from "./NotFound";
