<?php

use Gaufrette\Util\Path as OriginalPath;
/**
 * Path utils.
 *
 * @author  Antoine Hérault <antoine.herault@gmail.com>
 */
class Brizy_Admin_Guafrette_Path extends OriginalPath
{
    /**
     * Normalizes the given path.
     *
     * @param string $path
     *
     * @return string
     */
    public static function normalize($path)
    {
        $path = str_replace('\\', '/', $path);
        $prefix = static::getAbsolutePrefix($path);
        $path = substr($path, strlen($prefix));
        $parts = array_filter(explode('/', $path), 'strlen');
        $tokens = array();

        foreach ($parts as $part) {
            switch ($part) {
                case '.':
                    continue 2;
                case '..':
                    if (0 !== count($tokens)) {
                        array_pop($tokens);
                        continue 2;
                    } elseif (!empty($prefix)) {
                        continue 2;
                    }
                default:
                    $tokens[] = $part;
            }
        }

        return $prefix.implode('/', $tokens);
    }


}
