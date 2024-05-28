<?php

trait Brizy_Editor_Trait_Sanitize
{

    public function sanitizeJson($data)
    {
        if (current_user_can('unfiltered_html')) {
            return $data;
        }

        if (!$dataDecoded = json_decode($data, true)) {
            return $data;
        }

        $dataDecoded = wp_kses_post_deep($dataDecoded);

        $dataDecoded = $this->escapeJsonValues($dataDecoded);

        return json_encode($dataDecoded);
    }

    public function sanitizeDecodedJson($data)
    {
        if (current_user_can('unfiltered_html')) {
            return $data;
        }

        $data = wp_kses_post_deep($data);

        return $this->escapeJsonValues($data);
    }


    private function escapeJsonValues($value, $key = null)
    {
        if (is_array($value)) {
            foreach ($value as $key => $val) {
                $value[$key] = $this->escapeJsonValues($val, $key);
            }
        } elseif (is_object($value)) {
            foreach ($value as $key => $val) {
                $value->$key = $this->escapeJsonValues($val, $key);
            }
        } elseif (is_string($value)) {
            $value = $this->sanitizeValueByKey($value, $key);
        }

        return $value;
    }

    private function sanitizeValueByKey($value, $key = null)
    {
        switch ($key) {
            case 'text':
            case 'code':
            case 'shortcode':
                return $value;
            default:
                return esc_attr($value);
        }
    }

}