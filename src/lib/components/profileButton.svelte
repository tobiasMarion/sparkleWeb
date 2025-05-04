<script lang="ts">
	import { getProfile, type User } from '$lib/http/get-profile'
	import { LogOutIcon, Loader2 } from '@lucide/svelte'

	import { Avatar, DropdownMenu } from 'bits-ui'
	import { onMount } from 'svelte'

	function getInitials(name: string) {
		const initials = name
			.split(' ')
			.slice(0, 2)
			.map((word) => word.charAt(0).toUpperCase())
			.join('')

		return initials
	}

	let user: User | null = null

	onMount(async () => {
		user = await getProfile().then((res) => res.user)
	})
</script>

{#if !user}
	<Loader2 class="size-4 animate-spin text-white" />
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex items-center gap-3 rounded-md outline-none">
			<div class="hidden flex-col items-end md:flex">
				<span class="text-sm font-medium">{user?.name}</span>
				<span class="text-sm text-zinc-500">{user?.email}</span>
			</div>
			<span class="text-sm font-medium md:hidden">
				{user?.name.split(' ')[0]}
			</span>
			<Avatar.Root class="size-8">
				{#if user?.avatarUrl}
					<Avatar.Image class="rounded-lg" src={user.avatarUrl} />
				{/if}

				{#if user?.name}
					<Avatar.Fallback>{getInitials(user?.name)}</Avatar.Fallback>
				{/if}
			</Avatar.Root>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content align="end" class="mt-2">
			<DropdownMenu.Item class="cursor-pointer">
				<a href="/auth/sign-out" class="flex items-baseline">
					<LogOutIcon class="mr-2 size-4" />
					Sign Out
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
